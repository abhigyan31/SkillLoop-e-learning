// js/logout.js

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".logoutBtn");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            try {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include"
                });
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                window.location.href = "index.html";
            }
        });
    });
});
