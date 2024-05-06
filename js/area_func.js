function is_valid_distance(police_x, police_y, target_x, target_y, radius) {
    return (police_y - radius <= target_y && police_x - radius <= target_x)
                && (police_y + radius >= target_y && police_x - radius <= target_x)
                 && (police_y - radius <= target_y && police_x + radius >= target_x)
                  && (police_y + radius >= target_y && police_x + radius >= target_x);
}

export function get_buildings_in_radius(zones, targetObjs, sourceObj) {
    
    const s = new Set();
    const counts = {}
    const police_distances = zones.filter(e => e instanceof sourceObj).map(e => e.get_coordinates())

    zones.filter(e => {
        const cor = e.get_coordinates();
        const target_x = cor.x;
        const target_y = cor.y;

        return police_distances.some(p => {
            return is_valid_distance(p.x, p.y, target_x, target_y, p.radius) && (targetObjs.some(target => e instanceof target)) && !(e instanceof sourceObj);
        });
    }).forEach(e => s.add(e.get_coordinates().x + "," + e.get_coordinates().y));

    zones.forEach(e => counts[e.type] = (counts[e.type] || 0) + 1);
    return {buildings: [...s], counts: counts};
}