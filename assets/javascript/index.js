// Common utilities (theme, sidebar, loader) are handled by common-utils.js

document.addEventListener('DOMContentLoaded', () => {
    // Typing animation (index page only) – guard for missing elements
    const typingElements = [
        { element: document.getElementById('typing-title'), text: 'Revampes' },
        { element: document.getElementById('typing-subtitle'), text: 'AfterTime' },
        { element: document.querySelector('#typing-location span'), text: 'HKG' },
        { element: document.querySelector('#typing-intro p:nth-child(1)'), text: 'Bullshit code creator' },
        { element: document.querySelector('#typing-intro p:nth-child(2)'), text: 'Yes font-end, No back-end, No code, Yes sports, Yes game, Yes draw, Yes chess!' },
    ].filter(item => item.element);

    const typingSpeed = 35;
    const delayBetweenElements = 500;

    function typeWriter(element, text, index, callback) {
        if (!element) return; // safety
        if (index < text.length) {
            element.classList.remove('typing-cursor');
            element.textContent += text.charAt(index);
            element.classList.add('typing-cursor');
            setTimeout(() => {
                typeWriter(element, text, index + 1, callback);
            }, typingSpeed);
        } else if (callback) {
            element.classList.remove('typing-cursor');
            setTimeout(callback, delayBetweenElements);
        }
    }

    function startTypingAnimation(elements, index = 0) {
        if (!elements || elements.length === 0) return;
        if (index < elements.length) {
            const { element, text } = elements[index];
            element.textContent = '';
            typeWriter(element, text, 0, () => {
                startTypingAnimation(elements, index + 1);
            });
        } else {
            // Typing animation finished, show skill boxes
            const skillBoxes = document.getElementById('skill-boxes');
            if (skillBoxes) {
                setTimeout(() => {
                    skillBoxes.classList.add('show');
                    // Show GitHub contributions after skill boxes
                    setTimeout(() => {
                        const githubContributions = document.getElementById('github-contributions');
                        if (githubContributions) {
                            githubContributions.classList.add('show');
                            loadGitHubContributions();
                        }
                    }, 300);
                }, 300);
            }
        }
    }

    // GitHub Contributions Calendar
    async function loadGitHubContributions() {
        const username = 'Revampes';
        const calendar = document.getElementById('contributions-calendar');
        const statsElement = document.getElementById('contributions-stats');
        
        try {
            // Fetch contributions using GitHub's contribution API (scraping approach)
            // Since GraphQL requires authentication, we'll use a workaround
            const year = new Date().getFullYear();
            
            // Try to fetch from GitHub's contribution graph
            const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch contributions');
            }
            
            const data = await response.json();
            
            // Process contribution data
            const contributions = {};
            let totalCount = 0;
            
            if (data.contributions) {
                data.contributions.forEach(day => {
                    contributions[day.date] = day.count;
                    totalCount += day.count;
                });
            }
            
            // Update stats
            statsElement.innerHTML = `<span class="total-contributions">${totalCount} contributions in the last year</span>`;
            
            renderContributionCalendar(contributions);
        } catch (error) {
            console.error('Error loading GitHub contributions:', error);
            calendar.innerHTML = '<div class="calendar-loading">Unable to load contributions</div>';
            statsElement.innerHTML = '<span class="total-contributions">Unable to load stats</span>';
        }
    }

    function renderContributionCalendar(contributions) {
        const calendar = document.getElementById('contributions-calendar');
        
        // Calculate dates - start from 52 weeks ago (364 days)
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364);
        
        // Move to the previous Sunday
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);
        
        // Calculate weeks
        const weeks = [];
        for (let week = 0; week < 53; week++) {
            const weekDays = [];
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(currentDate.getDate() + (week * 7) + day);
                
                if (currentDate <= today) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const count = contributions[dateStr] || 0;
                    weekDays.push({ date: currentDate, dateStr, count });
                }
            }
            if (weekDays.length > 0) {
                weeks.push(weekDays);
            }
        }
        
        // Create month labels container
        const monthsContainer = document.createElement('div');
        monthsContainer.className = 'calendar-months';
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let lastMonth = -1;
        let monthStartWeek = 0;
        
        // Calculate box width based on screen size
        const getBoxWidth = () => {
            if (window.innerWidth <= 480) return 11; // 8px box + 3px gap
            if (window.innerWidth <= 768) return 13; // 10px box + 3px gap
            return 15; // 12px box + 3px gap
        };
        
        const boxWidth = getBoxWidth();
        
        weeks.forEach((week, weekIndex) => {
            const firstDay = week[0].date;
            const month = firstDay.getMonth();
            
            // Check if this is the start of a new month
            if (month !== lastMonth) {
                // If we had a previous month, finalize it
                if (lastMonth !== -1) {
                    const prevLabel = monthsContainer.lastChild;
                    if (prevLabel) {
                        const weekSpan = weekIndex - monthStartWeek;
                        prevLabel.style.width = `${weekSpan * boxWidth}px`;
                    }
                }
                
                // Create new month label
                const monthLabel = document.createElement('span');
                monthLabel.className = 'month-label';
                monthLabel.textContent = monthNames[month];
                monthsContainer.appendChild(monthLabel);
                
                lastMonth = month;
                monthStartWeek = weekIndex;
            }
        });
        
        // Finalize the last month
        if (monthsContainer.lastChild) {
            const weekSpan = weeks.length - monthStartWeek;
            monthsContainer.lastChild.style.width = `${weekSpan * boxWidth}px`;
        }
        
        // Create day labels
        const daysLabels = document.createElement('div');
        daysLabels.className = 'calendar-days-labels';
        
        // Create 7 label slots (one for each day)
        for (let i = 0; i < 7; i++) {
            const label = document.createElement('div');
            label.className = 'day-label';
            
            // Only show labels for Mon (1), Wed (3), Fri (5)
            if (i === 1) label.textContent = 'Mon';
            else if (i === 3) label.textContent = 'Wed';
            else if (i === 5) label.textContent = 'Fri';
            
            daysLabels.appendChild(label);
        }
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        
        weeks.forEach(week => {
            week.forEach(day => {
                const dayBox = document.createElement('div');
                dayBox.className = `contribution-day level-${getContributionLevel(day.count)}`;
                
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                const formattedDate = day.date.toLocaleDateString('en-US', options);
                dayBox.title = `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formattedDate}`;
                
                grid.appendChild(dayBox);
            });
        });
        
        // Assemble calendar
        const calendarBody = document.createElement('div');
        calendarBody.className = 'calendar-body';
        calendarBody.appendChild(daysLabels);
        calendarBody.appendChild(grid);
        
        calendar.innerHTML = '';
        calendar.appendChild(monthsContainer);
        calendar.appendChild(calendarBody);
    }

    function getContributionLevel(count) {
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 6) return 2;
        if (count <= 9) return 3;
        return 4;
    }

    startTypingAnimation(typingElements);

    // Skills slider (index page only)
    const skillsSlider = document.querySelector('.skills-slider');
    if (skillsSlider) {
        skillsSlider.addEventListener('mouseenter', () => {
            skillsSlider.style.animationPlayState = 'paused';
        });
        skillsSlider.addEventListener('mouseleave', () => {
            skillsSlider.style.animationPlayState = 'running';
        });
    }

    document.querySelectorAll('a[href^="/"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`导航到: ${this.getAttribute('href')}`);
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(element => {
        observer.observe(element);
    });
});