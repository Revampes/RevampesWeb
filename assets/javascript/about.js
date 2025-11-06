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
        { name: "Go", level: 0 }
    ]
};

// Create skill elements with dash-based display
function createSkillElements() {
    const categories = document.querySelectorAll('.category');
    console.log('🔍 Found categories:', categories.length);
    
    categories.forEach(category => {
        const categoryName = category.querySelector('h2').textContent.trim();
        const skillsContainer = category.querySelector('.skills-container');
        const skills = skillsData[categoryName];
        
        console.log('📂 Category:', categoryName, '| Skills found:', skills ? skills.length : 0);
        
        if (skills && skillsContainer) {
            // Clear any existing content
            skillsContainer.innerHTML = '';
            
            skills.forEach((skill, index) => {
                const skillElement = document.createElement('div');
                skillElement.className = 'skill';
                
                // Use heavier Unicode dash character for better visibility
                const filledDashes = '━'.repeat(skill.level);
                const emptyDashes = '━'.repeat(5 - skill.level);
                
                skillElement.innerHTML = `
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-level-bar">
                        <span class="filled-dashes">${filledDashes}</span><span class="empty-dashes">${emptyDashes}</span>
                    </div>
                `;
                
                skillElement.style.animationDelay = `${index * 0.1}s`;
                skillsContainer.appendChild(skillElement);
                console.log(`✅ Added: ${skill.name} | Level: ${skill.level} | Filled: "${filledDashes}" | Empty: "${emptyDashes}"`);
            });
        } else {
            console.warn(`⚠️ Issue with category: ${categoryName} | Skills: ${skills ? 'found' : 'NOT FOUND'} | Container: ${skillsContainer ? 'found' : 'NOT FOUND'}`);
        }
    });
    console.log('✨ Finished creating all skills');
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
                    // Add progress bar animation
                    const progressBar = box.querySelector('.skill-progress-fill');
                    if (progressBar) {
                        progressBar.style.setProperty('--progress', box.dataset.progress);
                    }
                }, index * 100 + boxIndex * 150);
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

