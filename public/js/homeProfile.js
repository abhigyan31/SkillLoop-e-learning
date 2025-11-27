// js/homeProfile.js
document.addEventListener("DOMContentLoaded", () => {
    const headerAvatarImg = document.getElementById("headerProfileAvatar");
    const headerDefaultIcon = document.getElementById("headerDefaultAvatarIcon");
    const headerProfileName = document.getElementById("headerProfileName");

    async function loadHeaderProfile() {
        try {
            const res = await fetch("/api/user/me", {
                method: "GET",
                credentials: "include"
            });

            if (res.status === 401) {
                // if someone hits home without login, send back to index (login)
                window.location.href = "index.html";
                return;
            }

            if (!res.ok) {
                console.error("Failed to load header profile");
                return;
            }

            const data = await res.json();
            const user = data.user || {};

            const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
            if (fullName && headerProfileName) {
                headerProfileName.textContent = fullName;
            }

            if (user.avatar && headerAvatarImg && headerDefaultIcon) {
                headerAvatarImg.src = user.avatar;
                headerAvatarImg.classList.remove("hidden");
                headerDefaultIcon.classList.add("hidden");
            }
        } catch (err) {
            console.error("Error loading header profile:", err);
        }
    }

    loadHeaderProfile();
});
