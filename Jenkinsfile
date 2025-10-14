pipeline { 
    agent { label 'Linux-slave-1' }

    environment {
        SONAR_PROJECT_KEY = 'Fin-Bookmyseat-Frontend'
        SONAR_CACHE = "${env.WORKSPACE}/.sonar-cache"
        DOCKER_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/movieapp-frontend:${BUILD_NUMBER}"
        AWS_REGION = "${AWS_REGION}"
        AWS_ACCOUNT_ID = "${AWS_ACCOUNT_ID}"
        
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'git@github.com:ALMGHAS/bookmyseat-frontend-service.git',
                        credentialsId: 'github-private-creds'
                    ]]
                ])
            }
        }

        stage('Restore Cache & Install Dependencies') {
            steps {
                script {
                    // Restore node_modules if exists
                    if (fileExists('node_modules')) {
                        echo "Using cached node_modules"
                    } else {
                        sh 'npm ci'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('SAST Scan') {
            steps {
                script {
                    // Ensure Sonar cache directory exists
                    sh "mkdir -p ${env.SONAR_CACHE}"

                    withSonarQubeEnv('SonarQube') {
                        sh """
                        /home/linux-slave/sonar-scanner-7.2.0.5079-linux-x64/bin/sonar-scanner \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.sources=src \
                          -Dsonar.test.inclusions=**/*.test.js,**/*.spec.js \
                          -Dsonar.userHome=${env.SONAR_CACHE}
                        """
                    }

                    timeout(time: 5, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        } // <-- Add missing closing bracket for previous stage

        stage('Container Security Scan') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
                        
                        ]) {
                        sh '''
                        # Create reports folder if not exists
                        mkdir -p reports
                        
                            set -e 
                        # Ensure AWS credentials are available as environment variables
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_REGION=$AWS_REGION
                        
                        aws ecr get-login-password --region $AWS_REGION  | \
                        docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                        
                        echo "Building image..."
                        docker build -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/movieapp-frontend:${BUILD_NUMBER} .
                        
                        echo "Pushing image..."
                        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/movieapp-frontend:${BUILD_NUMBER}
                        sleep 2
                        
                        # Download Trivy HTML template
                        curl -L -o reports/html.tpl https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl
                
                     echo "🔍 Running Trivy vulnerability + secret scan (remote mode)..."
                     trivy image --exit-code 1 --no-progress \
                        --severity HIGH,CRITICAL \
                        --cache-dir /tmp/trivy-cache \
                        --timeout 10m \
                        --scanners vuln,secret \
                        --username AWS \
                        --password "$(aws ecr get-login-password --region $AWS_REGION)" \
                        $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/movieapp-frontend:${BUILD_NUMBER} \
                        --format json -o reports/trivy-report.json
                        
                        echo "Generating readable HTML report..."
                            trivy convert \
                            --format template \
                            --template reports/html.tpl \
                            -o reports/trivy-report.html \
                            reports/trivy-report.json 
                        '''
                    }
                }
            }    
           
        }
    } 

    post {
        always {
            echo "Pipeline finished. Caching node_modules for next run."
            stash includes: 'node_modules/**', name: 'npm-cache', useDefaultExcludes: false
        }
    }
} 