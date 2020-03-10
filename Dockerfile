#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

#RUN curl -sL https://deb.nodesource.com/setup_12.x |  bash -
#RUN apt-get install nodejs -y
#RUN npm --version

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["StShop/StShop.UI.csproj", "StShop/"]
COPY ["StShop.DAL/StShop.DAL.csproj", "StShop.DAL/"]
RUN dotnet restore "StShop/StShop.UI.csproj"
COPY . .
WORKDIR "/src/StShop"
RUN dotnet build "StShop.UI.csproj" -c Release -o /app/build

WORKDIR "/src/StShop/ClientApp"
COPY ["StShop/ClientApp/package*.json", "./"]
COPY ["StShop/ClientApp/public/*", "./public/"]
COPY ["StShop/ClientApp/src/*", "./src/"]
RUN apt-get update
RUN apt-get install build-essential -y
RUN curl -sL https://deb.nodesource.com/setup_12.x |  bash -
RUN apt-get install nodejs -y
RUN npm --version
RUN node -v
RUN npm -v
RUN npm ci

WORKDIR "/src/StShop"
FROM build AS publish
RUN dotnet publish "StShop.UI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StShop.UI.dll"]