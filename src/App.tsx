import React, { useState } from "react";
import { achievementsList, unlockAchievement } from "./achievements";
import AchievementsView from "./AchievementsView";

export default function App() {
    const [achievements, setAchievements] = useState(achievementsList);
    const [showAchievements, setShowAchievements] = useState(false);

    // Пример: открытие достижения по клику
    function handleFirstAction() {
        setAchievements(prev => unlockAchievement("first_action", prev));
    }

    return (
        <div>
            {/* Кнопка для открытия меню достижений */}
            <button onClick={() => setShowAchievements(true)}>Достижения</button>
            {/* Кнопка для теста открытия достижения */}
            <button onClick={handleFirstAction}>Выполнить действие</button>
            {/* Модальное окно достижений */}
            {showAchievements && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowAchievements(false)}
                >
                    <div
                        style={{ background: "#222", padding: 24, borderRadius: 12 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            style={{
                                position: "absolute",
                                right: 24,
                                top: 24,
                                background: "transparent",
                                color: "#fff",
                                border: "none",
                                fontSize: 24,
                                cursor: "pointer",
                            }}
                            onClick={() => setShowAchievements(false)}
                        >
                            ×
                        </button>
                        <AchievementsView achievements={achievements} />
                    </div>
                </div>
            )}
            {/* ...existing code... */}
        </div>
    );
}