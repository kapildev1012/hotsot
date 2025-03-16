import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./Profile.css";

const Profile = () => {
    const { token } = useContext(StoreContext);
    const [userData, setUserData] = useState({});

    // Sample user data fetching logic (replace with API call if needed)
    useEffect(() => {
        if (token) {
            // Simulate fetching user data
            const sampleUserData = {
                name: "Kapil Dev",
                email: "kapildev@example.com",
                phone: "+91 9876543210",
                address: "Shimla, Himachal Pradesh",
            };
            setUserData(sampleUserData);
        }
    }, [token]);

    if (!token) {
        return <p className = "error-message" > Please log in to view your profile. < /p>;
    }

    return ( <
        div className = "profile-container" >
        <
        h1 > My Profile < /h1> <
        div className = "profile-details" >
        <
        p > < strong > Name: < /strong> {userData.name}</p >
        <
        p > < strong > Email: < /strong> {userData.email}</p >
        <
        p > < strong > Phone: < /strong> {userData.phone}</p >
        <
        p > < strong > Address: < /strong> {userData.address}</p >
        <
        /div> <
        /div>
    );
};

export default Profile;