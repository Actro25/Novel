export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
}

export const achievementsList: Achievement[] = [
    {
        id: "first_action",
        name: "Первое действие",
        description: "Выполните первое действие на сайте.",
        unlocked: false,
    },
    {
        id: "persistent",
        name: "Упорство",
        description: "Зайдите на сайт 7 дней подряд.",
        unlocked: false,
    },
    // ...добавьте свои достижения...
];

export function unlockAchievement(id: string, achievements: Achievement[]): Achievement[] {
    return achievements.map(a =>
        a.id === id ? { ...a, unlocked: true } : a
    );
}

export function isAchievementUnlocked(id: string, achievements: Achievement[]): boolean {
    return achievements.find(a => a.id === id)?.unlocked ?? false;
}
