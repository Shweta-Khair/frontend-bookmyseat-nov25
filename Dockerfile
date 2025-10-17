# In jenkins CI building application so directly copying output directory to container
# Stage: Serve with Nginx
FROM nginx:alpine
COPY Finastra-POC/Fin-Bookmyseat-Frontend/dist/frontend-service /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
