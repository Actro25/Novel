import React from "react";
import { Achievement } from "./achievements";
import "./achievements.css";

interface AchievementsViewProps {
    achievements: Achievement[];
}

export function AchievementsView({ achievements }: AchievementsViewProps) {
    return (
        <div className="achievements-container">
            <h2>Achievements</h2>
            <ul>
                {achievements.map(a => (
                    <li key={a.id} className={a.unlocked ? "unlocked" : "locked"}>
                        <span className="achievement-name">{a.name}</span>
                        <span className="achievement-desc">{a.description}</span>
                        <span className="achievement-status">
                            {a.unlocked ? "✓" : "✗"}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AchievementsView;
