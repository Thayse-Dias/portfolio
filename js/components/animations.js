// Animation utilities
export function fadeIn(element, duration = 500) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

export function slideIn(element, direction = 'left', duration = 500) {
    const transformMap = {
        left: 'translateX(-100%)',
        right: 'translateX(100%)',
        up: 'translateY(-100%)',
        down: 'translateY(100%)'
    };
    
    element.style.transform = transformMap[direction] || transformMap.left;
    element.style.transition = `transform ${duration}ms ease`;
    
    setTimeout(() => {
        element.style.transform = 'translate(0, 0)';
    }, 100);
}