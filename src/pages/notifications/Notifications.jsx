import React, { useState } from "react";
import "./notifications.css";
import { toast } from "react-toastify";
import {
    NotificationsActiveRounded,
    PersonOutlineRounded,
    LocalTaxiOutlined,
    GroupsRounded,
    SendRounded,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

const TARGETS = [
    { value: "users", label: "Users", icon: <PersonOutlineRounded />, accent: "blue" },
    { value: "drivers", label: "Drivers", icon: <LocalTaxiOutlined />, accent: "violet" },
    { value: "all", label: "Everyone", icon: <GroupsRounded />, accent: "green" },
];

const TITLE_LIMIT = 65;
const BODY_LIMIT = 240;

export default function Notifications() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [target, setTarget] = useState("users");
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !body.trim()) {
            toast.error("Title and message are required.");
            return;
        }

        if (!window.confirm(`Send this notification to ${TARGETS.find(t => t.value === target).label}?`)) {
            return;
        }

        setSending(true);
        try {
            const res = await axiosInstance.post("/admin/notifications/send", {
                title: title.trim(),
                body: body.trim(),
                target,
            });

            if (res.data?.success !== false) {
                toast.success("Notification sent successfully!");
                setTitle("");
                setBody("");
            } else {
                toast.error(res.data?.message || "Failed to send notification.");
            }
        } catch (error) {
            console.error("Send notification error:", error);
            toast.error("Something went wrong while sending the notification.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="notifications">
            <div className="notificationsHeader">
                <div className="notificationsHeaderIcon">
                    <NotificationsActiveRounded />
                </div>
                <div>
                    <h1 className="notificationsTitle">Send Notification</h1>
                    <p className="notificationsSubtitle">Push a message to users, drivers, or everyone.</p>
                </div>
            </div>

            <div className="notificationsLayout">
                {/* FORM */}
                <div className="notificationsCard">
                    <form onSubmit={handleSubmit}>
                        <div className="formField">
                            <label>Send To</label>
                            <div className="targetGroup">
                                {TARGETS.map((t) => (
                                    <button
                                        type="button"
                                        key={t.value}
                                        className={`targetOption targetOption--${t.accent} ${target === t.value ? "active" : ""}`}
                                        onClick={() => setTarget(t.value)}
                                    >
                                        <span className="targetOptionIcon">{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="formField">
                            <div className="fieldLabelRow">
                                <label htmlFor="notifTitle">Notification Title</label>
                                <span className={`charCount ${title.length > TITLE_LIMIT ? "over" : ""}`}>
                                    {title.length}/{TITLE_LIMIT}
                                </span>
                            </div>
                            <input
                                id="notifTitle"
                                type="text"
                                placeholder="e.g. Fare rates updated"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={TITLE_LIMIT}
                                required
                            />
                        </div>

                        <div className="formField">
                            <div className="fieldLabelRow">
                                <label htmlFor="notifBody">Notification Body</label>
                                <span className={`charCount ${body.length > BODY_LIMIT ? "over" : ""}`}>
                                    {body.length}/{BODY_LIMIT}
                                </span>
                            </div>
                            <textarea
                                id="notifBody"
                                rows={5}
                                placeholder="Write the message that will appear in the notification..."
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                maxLength={BODY_LIMIT}
                                required
                            />
                        </div>

                        <button type="submit" className="sendButton" disabled={sending}>
                            <SendRounded fontSize="small" />
                            {sending ? "Sending..." : "Send Notification"}
                        </button>
                    </form>
                </div>

                {/* PREVIEW */}
                <div className="previewCard">
                    <span className="previewLabel">Preview</span>

                    <div className="phoneMock">
                        <div className="phoneNotch" />
                        <div className="pushBanner">
                            <div className="pushIcon">
                                <NotificationsActiveRounded fontSize="small" />
                            </div>
                            <div className="pushContent">
                                <div className="pushTopRow">
                                    <span className="pushApp">Stark Cabs</span>
                                    <span className="pushTime">now</span>
                                </div>
                                <span className="pushTitle">{title || "Notification title"}</span>
                                <span className="pushBody">
                                    {body || "Your message will appear here as users and drivers will see it."}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="previewTargetNote">
                        Sending to <strong>{TARGETS.find((t) => t.value === target).label}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}