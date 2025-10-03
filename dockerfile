# Stage 1 : build de l'application
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Construire l'application pour la production
RUN npm run build

# Stage 2 : serveur Nginx
FROM nginx:alpine

# Copier le build depuis le stage précédent
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration nginx custom si nécessaire
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut
CMD ["nginx", "-g", "daemon off;"]
