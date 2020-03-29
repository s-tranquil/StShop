#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build

WORKDIR /src
COPY ["StShop.DAL/StShop.DAL.csproj", "StShop.DAL/"]
COPY ["StShop/StShop.UI.csproj", "StShop/"]
RUN dotnet restore "StShop/StShop.UI.csproj"
RUN true

COPY . .
RUN true

WORKDIR "/src/StShop/ClientApp"
RUN apt-get update
RUN apt-get install build-essential -y
RUN curl -sL https://deb.nodesource.com/setup_12.x |  bash -
RUN apt-get install nodejs -y
RUN npm ci
RUN npm run build

WORKDIR "/src/StShop"
FROM build AS publish
RUN dotnet publish "StShop.UI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StShop.UI.dll"]