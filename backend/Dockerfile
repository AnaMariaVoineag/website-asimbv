# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY backend/Backend/Backend/Backend.csproj backend/Backend/Backend/
RUN dotnet restore backend/Backend/Backend/Backend.csproj

# Copy source code and publish
COPY backend/Backend/Backend/ backend/Backend/Backend/
WORKDIR /src/backend/Backend/Backend
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5197
ENV ASPNETCORE_URLS=http://+:5197

ENTRYPOINT ["dotnet", "Backend.dll"]
