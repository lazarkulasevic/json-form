const formEl = document.getElementById('dynamic-form')
const generator = document.getElementById('generator')
const generateBlock = document.getElementById('btn-generate')
const jsonPlaceholder = document.getElementById('json')
const copyBtn = document.getElementById('copy')

const block = num => `
    <div class="form-group">
        <div id="label_${num}" class="p-1 m-1" contentEditable="true">Key ${num}</div>
        <input id="input_${num}" type="text" class="form-control" aria-describedby="Name" placeholder="Enter value" autocomplete="off">
    </div>
`
const formSaved = JSON.parse(localStorage.getItem('dynamic-form'))

if (!formSaved) {
    saveFormLocalStorage()
}

// init form
let blocks = [block(0), block(1)]
blocks.forEach(block => generator.innerHTML += block)

// console.log(Object.keys(formSaved).length)

generateBlock.addEventListener('click', () => {
    blocks.push(block(blocks.length))
    generator.innerHTML += block(blocks.length - 1)
    saveFormLocalStorage()
})

formEl.addEventListener('submit', event => {
    event.preventDefault()
    const form = formData()
    jsonPlaceholder.value = JSON.stringify(form)
    copyBtn.disabled = false
    jsonPlaceholder.style.height = jsonPlaceholder.scrollHeight + 'px'
})

copyBtn.addEventListener('click', () => {
    jsonPlaceholder.select()
    jsonPlaceholder.setSelectionRange(0, 99999)
    document.execCommand('copy')
    copyBtn.textContent = 'COPIED!'
    setTimeout(() => {
        copyBtn.textContent = 'COPY JSON'
    }, 2000)
})

generator.addEventListener('click', event => {
    if (event.target.tagName === 'INPUT') {
        event.target.addEventListener('blur', () => {
            console.log('blurrr')
        })
    }
})

function formData (form = {}) {
    const blocksAll = generator.children

    for (let i = 0; i < blocksAll.length; i++) {
        let key, value;
        for (let j = 0; j < blocksAll[i].children.length; j++) {
            if (j % 2 === 0) {
                key = blocksAll[i].children[j].textContent
            } else {
                value = blocksAll[i].children[j].value
            }            
        }
        form[key] = value
    }
    return form
}

function saveFormLocalStorage () {
    localStorage.setItem('dynamic-form', JSON.stringify(formData()))
}
