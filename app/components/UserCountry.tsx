import React, { useEffect, useState } from "react";

const Index = () => {
    // Déclarez userCountry comme string ou undefined
    const [userCountry, setUserCountry] = useState<string | undefined>(undefined);

    const fetchUserCountry = async () => {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            const userIP = data.ip;

            // Utilisez le point de terminaison JSON de ipapi.co
            const countryResponse = await fetch(`https://ipapi.co/${userIP}/json/`);
            const countryData = await countryResponse.json();

            const countryName = countryData.country_name; // Récupère le nom complet du pays
            setUserCountry(countryName);
        } catch (error) {
            console.error("Error fetching user country:", error);
        }
    };

    useEffect(() => {
        fetchUserCountry();
    }, []); // Fetch user country once when the component mounts

    return (
        <>
            {userCountry || ""}
        </>
    );
};

export default Index;

