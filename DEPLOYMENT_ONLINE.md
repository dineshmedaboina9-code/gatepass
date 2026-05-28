# 🌐 ONLINE PRODUCTION DEPLOYMENT GUIDE

This guide provides the complete, step-by-step instructions for deploying your **Student Gate Pass Management System** online.

---

## 🗄️ Step 1: Set Up Cloud MySQL Database (Aiven.io)

We will use **Aiven** because it offers a generous free tier for fully-managed MySQL instances, including automated backups and SSL security.

1. **Sign Up**: Go to [Aiven.io](https://aiven.io) and create a free account.
2. **Create MySQL Service**:
   - Click **Create Service**.
   - Choose **MySQL** as the service type.
   - Choose the **Free Plan** (available in AWS regions like `us-east-1` or `eu-west-1`).
   - Select your preferred cloud region and click **Create Service**.
3. **Get Credentials**: Once the service state is `Running` (~3-5 minutes), look at the **Connection Details** section on your service dashboard and copy:
   - **Host** (e.g., `mysql-12345-my-project.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (usually `avnadmin`)
   - **Password** (the generated secure password string)
   - **Database Name** (default is usually `defaultdb`, or you can create one named `gate_pass_system` using their UI).
4. **Import Database Dump (`db_dump.sql`)**:
   - Run this terminal command from the root of your project directory to import the local database backup directly into your live Aiven cloud database:
   ```bash
   mysql -h YOUR_CLOUD_HOST -P YOUR_CLOUD_PORT -u avnadmin -p defaultdb < database/db_dump.sql
   ```
   *(Replace `YOUR_CLOUD_HOST`, `YOUR_CLOUD_PORT`, and `defaultdb` with your actual Aiven credentials. You will be prompted to enter your cloud database password).*

---

## 🐙 Step 2: Push Your Project to GitHub

Both Render and Vercel are connected to GitHub for instant, automated CD (Continuous Deployment).

1. **Create GitHub Repository**: Go to [GitHub](https://github.com) and create a new **Private** or **Public** repository named `gatepass`.
2. **Add Remote and Push**: Run the following commands in the root folder of your project to initialize Git, add files, and push them to your repository:
   ```bash
   # Initialize git if not done
   git init
   
   # Add your new remote repository URL
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/gatepass.git
   
   # Rename branch to main if necessary
   git branch -M main
   
   # Stage and commit all files
   git add .
   git commit -m "Deployable production setup with cloud DB SSL & Vercel SPA routing"
   
   # Push to your GitHub repo
   git push -u origin main
   ```

---

## ⚡ Step 3: Deploy Backend Server to Render

We will deploy your Express.js API server to **Render.com** as a free Web Service.

1. **Sign Up**: Go to [Render.com](https://render.com) and log in using your GitHub account.
2. **Create New Web Service**:
   - Click the **New +** button and select **Web Service**.
   - Connect your newly created `gatepass` GitHub repository.
3. **Configure Service Settings**:
   - **Name**: `gatepass-backend` (or any custom name)
   - **Root Directory**: `backend` (⚠️ *Very Important: This tells Render the backend resides in the subfolder*)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Plan**: Select the **Free** plan.
4. **Add Environment Variables**:
   Click the **Advanced** button and add these variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DB_HOST`: *(Your Aiven Host, e.g. `mysql-12345-my-project.aivencloud.com`)*
   - `DB_PORT`: *(Your Aiven Port, e.g. `12345`)*
   - `DB_NAME`: `defaultdb` *(or the custom database name you created on Aiven)*
   - `DB_USER`: `avnadmin`
   - `DB_PASSWORD`: *(Your Aiven Password)*
   - `DB_SSL`: `true` *(⚠️ This activates the SSL security configuration we added to `database.js`)*
   - `JWT_SECRET`: *(Any long, random secure string for password tokens)*
   - `EMAIL_USER`: `your-email@gmail.com` *(optional: for email notifications)*
   - `EMAIL_PASSWORD`: `your-app-password` *(optional)*
5. **Deploy**: Click **Create Web Service**. Once deployed, copy your live backend URL (e.g., `https://gatepass-backend.onrender.com`).

---

## 🎨 Step 4: Deploy Frontend React to Vercel

We will deploy the React interface to **Vercel** for high-speed CDN delivery and performance.

1. **Sign Up**: Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. **Import Project**:
   - Click **Add New** → **Project**.
   - Import your `gatepass` repository.
3. **Configure Framework & Root Settings**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Click *Edit* and select the `frontend` folder (⚠️ *Very Important: This tells Vercel the React source resides in the subfolder*).
   - Keep default build and output settings (`npm run build`).
4. **Configure Environment Variables**:
   - Under **Environment Variables**, add:
     - Key: `REACT_APP_API_URL`
     - Value: `https://YOUR-RENDER-BACKEND-URL.onrender.com/api` *(Your live Render URL copied from Step 3, suffixed with `/api`)*
5. **Deploy**: Click **Deploy**. Vercel will build the React app and give you a production domain (e.g. `https://gatepass-frontend.vercel.app`).

---

## 🥳 Step 5: Test the Live Online System!

Open your live Vercel frontend URL:
1. **Student Registration**: Register a new student at `https://YOUR-APP.vercel.app/register`.
2. **Submit Exit Request**: Create an exit request (it will be saved to your cloud Aiven MySQL instance).
3. **Log in as HoD**: Open another browser/incognito tab and log in as `hod.cse@university.edu` / `HoD@123456` and click **Approve**.
4. **Log in as Admin**: Log in as `admin.portal@test.com` / `Admin@12345` and approve the pass to generate a live QR code.
5. **Verify Security scan**: Verify the pass can be successfully scanned or manually entered by the Gatekeeper (`gatekeeper1@university.edu` / `GateKeeper@123`).

**Congratulations! Your Gate Pass Management System is now fully operational in the cloud! 🚀**
