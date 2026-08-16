import React, { useEffect, useRef, useState } from "react";
import { useDriverStore } from "../../store/driverStore";
import getVehicleIcon from "../../utils/getVehicleIcon";
import socketService from "../../utils/socketServices";
import "./map.css";
import { Link } from "react-router-dom";
import DriverInfoWindow from "../../components/driverInfoWindow/driverInfoWindow";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";

export default function Map() {
    const { driverLists, setDriverLists, updateDriverLocation } = useDriverStore();
    const [driverLoader, setDriverLoader] = useState(true);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const mapInstanceRef = useRef(null);
    const [hoveredDriver, setHoveredDriver] = useState(null);
    const [infoWindowPosition, setInfoWindowPosition] = useState({ x: 0, y: 0 });
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    useEffect(() => {
        if (!window.google) {
            console.error("Google Maps not loaded!");
            return;
        }

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 9.6195, lng: 76.3542 },
            zoom: 13,
            mapId: process.env.REACT_APP_GOOGLE_MAP_ID
        });

        mapInstanceRef.current = map;
    }, []);

    useEffect(() => {
        socketService.connectAsAdmin();

        const unsubscribeAllDrivers = socketService.onAllDrivers(
            async (driversFromSocket) => {
                if (!driversFromSocket?.length) {
                    setDriverLists([]);
                    setDriverLoader(false);
                    return;
                }

                const driverIds = driversFromSocket.map(d => d.id).join(",");

                try {
                    const res = await axiosInstance.get(
                        "/driver/get-drivers-data",
                        { params: { ids: driverIds } }
                    );

                    const merged = res.data.map(dbDriver => {
                        const socketDriver = driversFromSocket.find(
                            d => d.id === dbDriver.id
                        );

                        return {
                            ...dbDriver,
                            latitude: socketDriver?.current?.latitude,
                            longitude: socketDriver?.current?.longitude,
                            heading: socketDriver?.heading,
                        };
                    });

                    setDriverLists(merged);
                } catch (err) {
                    console.error("❌ Driver fetch failed:", err);
                } finally {
                    setDriverLoader(false);
                }
            }
        );

        const unsubscribeDriverUpdates =
            socketService.onDriverLocationUpdates(updateDriverLocation);

        return () => {
            unsubscribeAllDrivers();
            unsubscribeDriverUpdates();
        };
    }, []);

    const driversWithCoords = driverLists.filter(
        (driver) =>
            typeof driver.latitude === "number" &&
            typeof driver.longitude === "number"
    );

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
        markersRef.current = {};

        driverLists.forEach((driver) => {
            if (!driver.latitude || !driver.longitude) return;

            const heading = driver.heading;

            const finalHeading =
                driver.vehicle_type === "Auto"
                    ? (heading + 180)
                    : heading;

            const icon = document.createElement("img");
            icon.src = getVehicleIcon(driver.vehicle_type);
            icon.style.width = "40px";
            icon.style.height = "50px";
            icon.style.transform = `rotate(${finalHeading}deg)`;
            icon.style.transformOrigin = "center";
            icon.style.cursor = "pointer";

            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                position: { lat: driver.latitude, lng: driver.longitude },
                map: mapInstanceRef.current,
                content: icon,
            });

            icon.addEventListener("mouseenter", (e) => {
                setHoveredDriver(driver);
                const mapRect = mapRef.current.getBoundingClientRect();
                setInfoWindowPosition({
                    x: e.clientX - mapRect.left + 15,
                    y: e.clientY - mapRect.top + 15,
                });
            });

            icon.addEventListener("mouseleave", () => {
                setHoveredDriver(null);
            });

            markersRef.current[driver.id] = marker;
        });
    }, [driverLists]);

    const getAvatar = (gender) => {
        if (gender?.toLowerCase() === "male") {
            return "https://i.pravatar.cc/150?img=12";
        } else if (gender?.toLowerCase() === "female") {
            return "https://i.pravatar.cc/150?img=47";
        } else {
            return "https://i.pravatar.cc/150";
        }
    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="mapWrapper">
            <h2 className="pageTitle">Driver Live Map</h2>

            <div className="mapArea">
                <div ref={mapRef} className="mapContainer"></div>

                {hoveredDriver && <DriverInfoWindow driver={hoveredDriver} position={infoWindowPosition} />}

                <div className={`driverPanel ${isPanelOpen ? "open" : "closed"}`}>
                    <button className="toggle-btn" onClick={togglePanel} aria-label="Toggle driver panel">
                        {isPanelOpen ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>

                    <div className="panel-content">
                        <div className="panelHeader">
                            <span className="liveDot" />
                            <h2 className="panelTitle">Live Drivers</h2>
                            <span className="panelCount">{driversWithCoords.length}</span>
                        </div>

                        <ul className="driverList">
                            {driverLoader ? (
                                <li className="loadingItem">Loading drivers…</li>
                            ) : driversWithCoords.length === 0 ? (
                                <li className="noDrivers">No active drivers found.</li>
                            ) : (
                                driversWithCoords.map((driver) => (
                                    <Link
                                        className="link"
                                        to={`/driver/${driver.id}`}
                                        key={driver.id}
                                        state={{ driverId: driver.id }}
                                    >
                                        <li className="driverItem">
                                            <img
                                                src={driver.profilePic || getAvatar(driver.gender)}
                                                className="panelProfile"
                                                alt=""
                                            />
                                            <div className="driverText">
                                                <p className="driverName">{driver.name}</p>
                                                <p className="driverCoords">
                                                    {driver.registration_number}, {driver.vehicle_type}
                                                </p>
                                            </div>
                                        </li>
                                    </Link>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}