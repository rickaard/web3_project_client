"use strict";

const coursesOutput = document.querySelector('#js--courses-output');
const worksOutput = document.querySelector('#js--works-output');
const webpagesOutput = document.querySelector('#js--webpages-output');
const contactForm = document.querySelector('#js--contact');

const coursesAPI = 'http://localhost/web3_project/server/api/courses/'
const worksAPI = 'http://localhost/web3_project/server/api/works/';
const webpagesAPI = 'http://localhost/web3_project/server/api/webpages/';
const contactURL = 'http://localhost/web3_project/server/admin/mail.php';


const  fetchCourses =  ()  => {
    fetch(coursesAPI)
    .then(resp => resp.json())
    .then(data => {
        let courses = data.map((item, index) => {
            return `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <h4>${item.course_name}</h4>
                    </div>
                    <div class="flip-card-back">
                        <div class="flip-card-back-item-wrapper">
                            <div class="flip-card-back-item">
                                <span>Lärosäte:</span>
                                <h6>${item.school_name}</h6>
                            </div>

                            <div class="flip-card-back-item">
                                <span>Kursnamn:</span>
                                <h6>${item.course_name}</h6>
                            </div>

                            <div class="flip-card-back-item">
                                <span>Startdatum:</span>
                                <h6>${item.start_date}</h6>
                            </div>

                            <div class="flip-card-back-item">
                                <span>Slutdatum:</span>
                                <h6>${item.end_date}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            `
        }).join("");
        if (coursesOutput != null) {
            coursesOutput.innerHTML = courses;
        }
    })
    .catch(error => console.log(error))
};

const fetchWorks = () => {
    fetch(worksAPI)
    .then(resp => resp.json())
    .then(data => {
        let works = data.map((item, index) => {
            return `
            <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <h4>${item.work_place}</h4>
                </div>
                <div class="flip-card-back">
                    <div class="flip-card-back-item-wrapper">
                        <div class="flip-card-back-item">
                            <span>Arbetsplats:</span>
                            <h6>${item.work_place}</h6>
                        </div>

                        <div class="flip-card-back-item">
                            <span>Titel:</span>
                            <h6>${item.work_title}</h6>
                        </div>

                        <div class="flip-card-back-item">
                            <span>Startdatum:</span>
                            <h6>${item.start_date}</h6>
                        </div>

                        <div class="flip-card-back-item">
                            <span>Slutdatum:</span>
                            <h6>${item.end_date}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        `
        }).join("");
        if (worksOutput != null) {
            worksOutput.innerHTML = works;
        } 
    })
    .catch(error => console.log(error))
};




const fetchWebpages = () => {
    fetch(webpagesAPI)
    .then(resp => resp.json())
    .then(data => {
        let webpages = data.map((item, index) => {
            return `
            <div class="webpage-item">
                <div class="webpage-image">
                    <img src="${item.page_image}" alt="Bild på webappen ${item.page_title}">
                </div>
                <div class="webpage-info">
                    <h4>${item.page_title}</h4>
                    <p>${item.page_description}</p>
                    <div class="webpage-links">
                        <a class="btn btn-transparent" href="${item.page_url}" target="_blank">Live demo</a>
                        ${item.page_github != "" ? `<a class="btn btn-transparent" href="${item.page_github}" target="_blank">Github</a>` : ''}
                    </div>
                </div>
            </div>
            `
        }).join("");
        webpagesOutput.innerHTML = webpages;
    })
    .catch(error => console.log(error))
};


const sendMail = (event) => {
    event.preventDefault();

    // Reset the contact-response 
    document.querySelector('#contact-response').innerHTML = '';

    // Stringify the inputs
    let jsonStr = JSON.stringify({
        'email_name': document.querySelector('#email_name').value,
        'email': document.querySelector('#email').value,
        'msg': document.querySelector('#msg').value
    });
    
    // Send POST request to mailscript
    fetch(contactURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonStr
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.email_validation == 'ok') {
            document.querySelector('#contact-response').classList.add('succes-msg');
            document.querySelector('#contact-response').innerHTML = data.message;
        }
        if (data.email_validation == 'error') {
            document.querySelector('#contact-response').classList.add('error-msg');
            document.querySelector('#contact-response').innerHTML = data.message;
        }
        contactForm.reset();

    })
    .catch(error => console.log('error frn fetch',error))
    
}

// Call the fetching functions when DOM is finished loading the DOM tree
window.addEventListener('DOMContentLoaded', () => {   
    fetchCourses();
    fetchWorks();
    fetchWebpages();
});

if (contactForm != null) {
    contactForm.addEventListener('submit', sendMail);
}
