# Step 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build
 
# Step 2: Build the Spring Boot backend JAR (incorporating frontend static resources)
FROM maven:3.9-eclipse-temurin-21 AS backend-builder
WORKDIR /app
COPY backend/personal-brand-engine/pom.xml ./
RUN mvn dependency:go-offline
COPY backend/personal-brand-engine/src ./src
# Copy static files built in Step 1
COPY --from=frontend-builder /frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests
 
# Step 3: Run the Spring Boot application JAR
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/target/personal-brand-engine-1.0.0.jar app.jar
EXPOSE 7860
ENV PORT=7860
ENV SPRING_PROFILES_ACTIVE=dev
ENTRYPOINT ["java", "-jar", "app.jar"]
