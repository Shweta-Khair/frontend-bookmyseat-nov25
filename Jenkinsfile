// Jenkinsfile for React Microservice (e.g., app-react)
pipeline { 
    agent { label 'Linux-slave-1' } // Runs on Slave-1 or Slave-2
    /*tools {
        nodejs 'Node20'
        
    } */
    
    environment {
        DOCKER_IMAGE = "543816070942.dkr.ecr.us-east-1.amazonaws.com/movieapp-frontend:${BUILD_NUMBER}"
        SONAR_PROJECT_KEY = 'Fin-Bookmyseat-Frontend'
        AWS_REGION = 'us-east-1'
        EKS_CLUSTER = 'Fin-Movieapp-Dev'
    }
    stages {
        stage('Checkout') {
            steps { 
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']], //Adjust branch
                    userRemoteConfigs: [[ url: 'git@github.com:ALMGHAS/bookmyseat-frontend-service.git', credentialsId: 'github-private-creds' ]]
                ]) // Jenkins credential ID for private repo access
            }
        }

        stage('SAST Scan') {
            steps {
                sh 'npm ci'
                sh 'npm run lint' // Basic JS SAST via ESLint
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                    -Dsonar.sources=src \
                    -Dsonar.test.inclusions=**/*.test.js,**/*.spec.js \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \

                     '''
                    // -Dsonar.login=${SONAR_TOKEN}'
                }
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Test') {
            parallel {
                stage('Build') {
                    steps {
                        sh 'npm run build'
                    }
                }
                stage('Test') {
                    steps {
                        sh 'npm test -- --coverage --watchAll=false'
                    }
                    post {
                        always {
                            junit 'coverage/junit.xml'
                            publishCoverage adapters: [istanbulCoberturaAdapter('coverage/cobertura-coverage.xml')]
                        }
                    }
                }
            }
        }

        stage('Container Security Scan') {
            steps {
                script {
                    sh """
                        docker build -t ${DOCKER_IMAGE} .
                        echo '${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com' | docker login --username AWS --password-stdin
                        docker tag ${DOCKER_IMAGE} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${DOCKER_IMAGE}
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${DOCKER_IMAGE}
                    """
                    sh "trivy image --exit-code 1 --no-progress ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy to EKS') {
            when { branch 'main' }
            steps {
                withAWS(credentials: 'aws-creds', region: '${AWS_REGION}') {
                    script {
                        sh """
                            aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER}
                            helm upgrade --install react-app ./helm-chart --set image.repository=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${DOCKER_IMAGE} --set image.tag=${BUILD_NUMBER}
                        """
                    }
                }
            }
        }
    }
}