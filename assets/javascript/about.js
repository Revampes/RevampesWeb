const skillsData = {
    "Languages": [
        { name: "Cantonese", level: 3 },
        { name: "Mandarin", level: 3 },
        { name: "English", level: 1 }
    ],
    "Programming": [
        { name: "Python", level: 2 },
        { name: "C++", level: 1 },
        { name: "Java", level: 3 },
        { name: "HTML & CSS", level: 3 },
        { name: "JavaScript", level: 2 },
        { name: "Kotlin", level: 3 }
    ],
    "Sports": [
        { name: "Squash", level: 2 },
        { name: "Tennis", level: 3 },
        { name: "Basketball", level: 2 },
        { name: "Table Tennis", level: 1 },
        { name: "Badminton", level: 1 }
    ],
    "Drawing": [
        { name: "Painting", level: 1 },
        { name: "Sketching", level: 2 },
        { name: "Pixel Drawing", level: 2 }
    ],
    "Games": [
        { name: "2048", level: 2 },
        { name: "Sudoku", level: 2 },
        { name: "Go", level: 1 }
    ]
};

// Create skill elements with box-based display
function createSkillElements() {
    const categories = document.querySelectorAll('.category');
    console.log('Found categories:', categories.length);
    
    categories.forEach(category => {
        const categoryName = category.querySelector('h2').textContent;
        const skillsContainer = category.querySelector('.skills-container');
        const skills = skillsData[categoryName];
        
        console.log('Category:', categoryName, 'Skills:', skills);
        
        if (skills) {
            skills.forEach((skill, index) => {
                const skillElement = document.createElement('div');
                skillElement.className = 'skill';
                
                // Create dash-based level display
                let levelDisplay = '';
                for (let i = 0; i < skill.level; i++) {
                    levelDisplay += '─';  // Filled dash
                }
                for (let i = skill.level; i < 5; i++) {
                    levelDisplay += '─';  // Empty dash (lighter color via CSS)
                }
                
                skillElement.innerHTML = `
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-level-bar">
                        <span class="filled-dashes">${'─'.repeat(skill.level)}</span><span class="empty-dashes">${'─'.repeat(5 - skill.level)}</span>
                    </div>
                `;
                // Add staggered delay for each skill in category
                skillElement.style.animationDelay = `${index * 0.1}s`;
                skillsContainer.appendChild(skillElement);
                console.log('Added skill:', skill.name, 'Level:', skill.level);
            });
        }
    });
    console.log('Finished creating all skills');
}

// Animate boxes when they come into view
function animateSkillsOnScroll() {
    const skillElements = document.querySelectorAll('.skill');
    
    skillElements.forEach((skill, index) => {
        const rect = skill.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
        
        if (isVisible && !skill.classList.contains('animated')) {
            // Mark as animated
            skill.classList.add('animated');
            
            // Animate boxes one by one
            const boxes = skill.querySelectorAll('.skill-box.filled');
            boxes.forEach((box, boxIndex) => {
                setTimeout(() => {
                    box.classList.add('animate-fill');
                }, index * 100 + boxIndex * 150); // Staggered box animation
            });
            
            // Add glow effect for high skills (4+ boxes)
            if (boxes.length >= 4) {
                setTimeout(() => {
                    skill.classList.add('high-skill');
                }, index * 100 + boxes.length * 150 + 300);
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating skills...');
    createSkillElements();
    // Trigger animation after elements are created
    setTimeout(() => {
        animateSkillsOnScroll();
    }, 100);
});

// Run animation on scroll
window.addEventListener('scroll', animateSkillsOnScroll);
// Also check on resize
window.addEventListener('resize', animateSkillsOnScroll);