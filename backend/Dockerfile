# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY backend/Backend/Backend/Backend.csproj backend/Backend/Backend/
RUN dotnet restore backend/Backend/Backend/Backend.csproj

# Copy source code and publish
COPY backend/Backend/Backend/ backend/Backend/Backend/
WORKDIR /src/backend/Backend/Backend
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5197
ENV ASPNETCORE_URLS=http://+:5197
# Kerberos is not used and its library is not in the image; without this, Npgsql 10 logs a load error.
ENV PGGSSENCMODE=disable

ENTRYPOINT ["dotnet", "Backend.dll"]
