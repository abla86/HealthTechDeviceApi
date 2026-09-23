FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY HealthTechDeviceApi.csproj ./
RUN dotnet restore HealthTechDeviceApi.csproj

COPY . .
RUN dotnet publish HealthTechDeviceApi.csproj -c Release -o /app/publish --no-restore --no-self-contained

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
RUN mkdir -p /app/data && chown -R $APP_UID:$APP_UID /app

ENV ASPNETCORE_URLS=http://+:8080
ENV ConnectionStrings__HealthTech="Data Source=/app/data/healthtech.db"
ENV DOTNET_EnableDiagnostics=0

EXPOSE 8080
USER $APP_UID

ENTRYPOINT ["dotnet", "HealthTechDeviceApi.dll"]
