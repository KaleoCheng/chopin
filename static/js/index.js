function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // call on next available tick
        setTimeout(fn, 1)
    } else {
        document.addEventListener('DOMContentLoaded', fn)
    }
}

function getAnchor(url) {
    return (url.split('#').length > 1) ? url.split('#')[1] : null;
}

function getTitle(url){
    return fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html')
        const title = doc.querySelectorAll('title')[0]
          if (title.innerText.length > 50 ){
              return title.innerText.slice(0, 50) + '...'
          }
        return title.innerText
    })
}

function shortenURL(links){
    links = Array.from(links)
    links.forEach(link => {
        if (link.hostname == 'github.com'){
            const anchor = getAnchor(link.href)
            const pathName = link.pathname
                                 .slice(1)
                                 .replace('/pull/', '#')
                                 .replace('/issues/', '#')
                                 .replace(/^(Wiredcraft\/)/,'')
            link.innerHTML = pathName
            if (anchor) {
                link.innerText += ' (comment)'
            }
        }
    })
}

function toggleHighlight(e) {
  const height = 250
  e.preventDefault()
  let link = e.target
  let div = link.parentElement.parentElement
  let highlightDiv = link.parentElement

  if (link.innerHTML == "more&nbsp;") {
    link.innerHTML = "less&nbsp;"
    div.style.maxHeight = ""
    div.style.overflow = "none"
    div.querySelectorAll('pre').forEach(pre => {
        pre.style.filter = ''
    })
    highlightDiv.style.bottom = "15px"
  }
  else {
    link.innerHTML = "more&nbsp;"
    div.style.maxHeight = `${height}px`
    div.style.overflow = "hidden"
    div.scrollIntoView({ behavior: 'smooth' })
    div.querySelectorAll('pre').forEach(pre => {
        pre.style.filter = 'blur(0.8px)'
    })
    highlightDiv.style.bottom = "0"
  }
}

function makeCollapsible() {
  const height = 250
  const divs = document.querySelectorAll('.highlight')
  divs.forEach(div => {
      div.querySelectorAll('pre').forEach(pre => {
          pre.style.backgroundColor = ''
      })
      if (div.offsetHeight > height) {
            div.querySelectorAll('pre').forEach(pre => {
                pre.style.filter = 'blur(0.8px)'
            })
            div.style.maxHeight = `${height}px`
            div.style.overflow = "hidden"

            let e = document.createElement('div')
            e.className = "highlight-link"
            e.innerHTML = '<a href="">more&nbsp;</a>'
            div.appendChild(e)
      }

  })

  const links = document.querySelectorAll('.highlight-link')
  links.forEach(link => {
        link.addEventListener('click', toggleHighlight)
    })
}

docReady(function() {
    makeCollapsible()
    shortenURL(document.links)
})
