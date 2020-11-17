export default function getColor(seed: number): string {
    return "#" + Math.floor((Math.abs(Math.sin(seed + 1000) * 16777215)) % 16777215).toString(16);
}
