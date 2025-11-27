// js/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    const profileNameSpan = document.getElementById("profileName");
    const profileEmailSpan = document.getElementById("profileEmail");
    const profileMobileSpan = document.getElementById("profileMobile");
    const profileAddressSpan = document.getElementById("profileAddress");
    const profileDobSpan = document.getElementById("profileDob");
    const profileSexSpan = document.getElementById("profileSex");

    const profileView = document.getElementById("profileView");
    const profileEditForm = document.getElementById("profileEditForm");

    const editBtn = document.getElementById("editProfileBtn");
    const cancelEditBtn = document.getElementById("cancelEditProfile");

    const editFirstName = document.getElementById("editFirstName");
    const editLastName = document.getElementById("editLastName");
    const editEmail = document.getElementById("editEmail");
    const editMobile = document.getElementById("editMobile");
    const editAddress = document.getElementById("editAddress");
    const editDob = document.getElementById("editDob");
    const editSex = document.getElementById("editSex");

    const profileImageInput = document.getElementById("profileImageInput");
    const profileAvatarImg = document.getElementById("profileAvatar");
    const defaultAvatarIcon = document.getElementById("defaultAvatarIcon");

    const dashboardUserHeading = document.getElementById("dashboardUser");

    let currentProfile = null;
    let currentAvatarDataUrl = null;

    function toDateInputValue(iso) {
        if (!iso) return "";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 10);
    }

    // Load profile from backend
    async function loadProfileFromBackend() {
        try {
            const res = await fetch("/api/user/me", {
                method: "GET",
                credentials: "include"
            });

            if (res.status === 401) {
                window.location.href = "index.html";
                return;
            }

            if (!res.ok) {
                console.error("Failed to load profile");
                return;
            }

            const data = await res.json();
            const user = data.user || {};
            currentProfile = user;

            const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "-";
            profileNameSpan.textContent = fullName;
            profileEmailSpan.textContent = user.email || "-";
            profileMobileSpan.textContent = user.mobile || "-";
            profileAddressSpan.textContent = user.address || "-";
            profileDobSpan.textContent = user.dob
                ? toDateInputValue(user.dob)
                : "-";
            profileSexSpan.textContent = user.sex || "-";

            if (dashboardUserHeading && fullName !== "-") {
                dashboardUserHeading.textContent = `Welcome Back, ${fullName} 👋`;
            }

            if (user.avatar) {
                profileAvatarImg.src = user.avatar;
                profileAvatarImg.classList.remove("hidden");
                defaultAvatarIcon.classList.add("hidden");
                currentAvatarDataUrl = user.avatar;
            }
        } catch (err) {
            console.error("Error loading profile:", err);
        }
    }

    loadProfileFromBackend();

    // Enter edit mode
    if (editBtn) {
        editBtn.addEventListener("click", () => {
            const user = currentProfile || {};

            editFirstName.value = user.firstName || "";
            editLastName.value = user.lastName || "";
            editEmail.value = user.email || "";
            editMobile.value = user.mobile || "";
            editAddress.value = user.address || "";
            editDob.value = user.dob ? toDateInputValue(user.dob) : "";
            editSex.value = user.sex || "";

            profileView.classList.add("hidden");
            profileEditForm.classList.remove("hidden");
        });
    }

    // Cancel edit
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", () => {
            profileEditForm.reset();
            profileEditForm.classList.add("hidden");
            profileView.classList.remove("hidden");
        });
    }

    // Handle image selection
    if (profileImageInput) {
        profileImageInput.addEventListener("change", () => {
            const file = profileImageInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const dataUrl = e.target.result;
                currentAvatarDataUrl = dataUrl;
                profileAvatarImg.src = dataUrl;
                profileAvatarImg.classList.remove("hidden");
                defaultAvatarIcon.classList.add("hidden");
            };
            reader.readAsDataURL(file);
        });
    }

    // Save profile to backend
    if (profileEditForm) {
        profileEditForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const body = {
                firstName: editFirstName.value.trim(),
                lastName: editLastName.value.trim(),
                email: editEmail.value.trim(),
                mobile: editMobile.value.trim(),
                address: editAddress.value.trim(),
                dob: editDob.value || null,
                sex: editSex.value || "",
                avatar: currentAvatarDataUrl || null
            };

            try {
                const res = await fetch("/api/user/profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(body)
                });

                if (res.status === 401) {
                    window.location.href = "index.html";
                    return;
                }

                if (!res.ok) {
                    console.error("Failed to update profile");
                    return;
                }

                const data = await res.json();
                const user = data.user || {};
                currentProfile = user;

                const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "-";
                profileNameSpan.textContent = fullName;
                profileEmailSpan.textContent = user.email || "-";
                profileMobileSpan.textContent = user.mobile || "-";
                profileAddressSpan.textContent = user.address || "-";
                profileDobSpan.textContent = user.dob
                    ? toDateInputValue(user.dob)
                    : "-";
                profileSexSpan.textContent = user.sex || "-";

                if (dashboardUserHeading && fullName !== "-") {
                    dashboardUserHeading.textContent = `Welcome Back, ${fullName} 👋`;
                }

                if (user.avatar) {
                    profileAvatarImg.src = user.avatar;
                    profileAvatarImg.classList.remove("hidden");
                    defaultAvatarIcon.classList.add("hidden");
                    currentAvatarDataUrl = user.avatar;
                }

                profileEditForm.classList.add("hidden");
                profileView.classList.remove("hidden");
            } catch (err) {
                console.error("Error updating profile:", err);
            }
        });
    }
});
