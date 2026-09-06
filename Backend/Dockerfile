# Multi-stage build so the final image only ships the built jar + a JRE,
# not the full Maven toolchain/dependency cache.

# --- Build stage --- (using the official Maven image rather than the
# ./mvnw wrapper, since the wrapper needs curl/wget to fetch its own Maven
# distribution and slim JDK base images don't reliably include either)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom first so Docker can cache the dependency download layer as
# long as pom.xml doesn't change.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src src
RUN mvn -B clean package -DskipTests

# --- Runtime stage ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render (and most PaaS Docker runners) set PORT at runtime; the app reads
# it via server.port=${PORT:8080} in application.properties.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
