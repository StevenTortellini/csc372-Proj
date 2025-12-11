#  **Moodboard Music App — CSC 372 Full-Stack Project**

A full-stack music exploration and playlist-building application that integrates Spotify authentication, mood-based categorization, and a custom UI powered by React and Tailwind/DaisyUI. Users can log in with Spotify, browse tracks, build playlists, view moods, and interact with a clean, dynamic interface.




---

##  **Tech Stack**

### **Frontend**
- **React (Vite)**
- **TailwindCSS** for utility-first styling  
- **DaisyUI** for themed UI components  
- Playlist management, mood tagging, and reactive UI updates  

### **Backend**
- **Express.js** server  
- **Spotify OAuth 2.0 Authentication**  
- **Spotify Web API** integration for fetching:
  - Track metadata  
  - Album art  
  - Artist info  


### **Database**
- **PostgreSQL**
- Tables:
  - `users`  
  - `playlists`  
  - `songs`  

---

##  **Setup Instructions**

### **1. Clone the Repository**
### **2. Install dependencies in client and server: npm install**
### **3. Create your own spotify app and update .env **
### **4. Create your own PG DB using the sql dump in the root of the server dir. Update url in .env ( you may need to change model db.js i used render so it looks different than those who used neon)**
### **5. Start front and backend and enjoy**

---

##  Design Choices
I chose react because of the modularity of the framework. When building the moodboard view, having each component in a separate file made the workflow smoother rather than having it all in 1 tsx file.

The use of express just came from the fact that we used it all semester. In previous courses, I've used PHP-based frameworks. The workflow is very similar with the MVC layout the syntax was fairly easy to pick up.

A main flaw is my DB schema I have no relational tables I store the relation in the objects themselves which is poor design.

---

##  Challenges
1. Early on, Tailwind4 gave me issues, as I was unable to create the config files using the tailwind cmd for it. I manually created the files and checked my package and node modules to confirm it was installed, but it never applied my styles. The solution ultimately was to use tailwind3 and it worked.

2. The spotify api is tricky to use, especially with audio playback. I also had small issues with authentication. I was able to receive and see the response in the chrome network tab from logging in through spotify. The issue was the redirect URI was to 127..... and my application was hosted on local host. The quick fix was to host it off of 127...+ the port I used.

---

##  Learning Outcome
I think the main learning outcome I got from this project is the usefulness of the division of work. Thats not to say solo projects like this arent useful, they absolutely are to get the big picture on how things work together. In my capstone project, we created a full stack web and mobile app, but we each were in charge of our own separate features, which means over time, we're able to focus on the functionality and optimizations of what we were creating. The final result was a much more complete project (to be expected). I can absolutely create a project solo comparable to the capstone, it would just take more time and a methodical approach. I always like working from the ground up creating a solid DB schema first, then backend, and finally frontend. I find that approaching it that way reduces the number of times I have to adjust the DB and backend, which can cause a lot of headaches.


---

##  Future Work
The vision was to have the ui respond to the current song playing. I have the React states implemented and ready to go. I just wasn't able to incorporate the music actually playing, due to other bugs that took precedent. (It doesn't matter if my audio plays if my users cant log in,save data, etc..)













