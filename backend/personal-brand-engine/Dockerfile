FROM eclipse-temurin:17-jdk-alpine as builder
WORKDIR /build
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV OPENAI_API_KEY=your-api-key-here
ENV DB_URL=jdbc:mysql://mysql:3306/personal_brand_db
ENV DB_USERNAME=root
ENV DB_PASSWORD=password

ENTRYPOINT ["java", "-jar", "app.jar"]
