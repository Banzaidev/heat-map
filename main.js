import './style.css'
import * as d3 from 'd3'


const data = await d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
const baseTemp = data['baseTemperature']
const monthlyVariance = data['monthlyVariance']
const graph = {
  'width': 1400,
  'height': 600,
  'rect-w': 2,
  'marginX': 70,
  'marginY': 50,
  'widthLegend': 500,
  'heightLegend': 500
}


document.querySelector('#root').innerHTML = `
  <div id='app'>
    <h1 id='title'>Monthly Global Land-Surface Temperature</h1>
    <h3 id='description'>1753 - 2015: base temperature ${baseTemp}℃</h3> 
  </div>
  
`


d3.select('#app')
.append('svg')
.attr('width', graph.width)
.attr('height', graph.height)



const scaleX = d3.scaleTime()
.domain(
  [new Date(d3.min(monthlyVariance, d =>d['year']),0), new Date(d3.max(monthlyVariance, d=> d['year']),0)])
.range([0, graph.width-graph['marginX']])

//scaleY used for month
const scaleY = d3.scaleBand()
.domain([0,1,2,3,4,5,6,7,8,9,10,11])
.range([graph.height - graph['marginY'],0])


const rectLegend = d3.range(d3.min(monthlyVariance, d => baseTemp - d['variance']), d3.max(monthlyVariance, d=> baseTemp - d['variance']))

const scaleLegend = d3.scaleBand()
.domain(rectLegend)
.range([0,graph.widthLegend])
.padding(0)

const scaleLegendColor = d3.scaleLinear()
.domain([d3.min(monthlyVariance, d => baseTemp - d['variance']), d3.max(monthlyVariance, d=> baseTemp - d['variance'])])
.range(['blue','red'])
.interpolate(d3.interpolateHcl)


d3.select('svg')
.append('g')
.attr('id','x-axis')
.attr('transform', `translate(${graph.marginX}, ${graph.height - graph.marginY})`)
.call(d3.axisBottom(scaleX))


d3.select('svg')
.append('g')
.attr('id', 'y-axis')
.attr('transform', `translate(${graph.marginX},0)`)
.call(d3.axisLeft(scaleY).tickFormat(t => {
  let date = new Date()
  date.setMonth(t)
  let month = date.toLocaleString('en-gb',{month:'long'})
  return month
}))

d3.select('svg')
.selectAll('rect')
.data(monthlyVariance)
.enter()
.append('rect')
.attr('class','cell')
.attr('data-month',data => data.month -1) //in the data month are indexed (1,2,...12) and not (0,1,2...11)
.attr('data-year', data => data.year)
.attr('data-temp', data => baseTemp - data.variance)
.attr('data-variance',data=>data.variance)
.attr('width','5')
.attr('height','46')
//.attr('x',data => graph.marginX+ 0.8 +scaleX(new Date().setFullYear(data.year)) ) setFullYear return a number and not a Date obj, which is required for d3.scaleTime
.attr('x',data => graph.marginX+ 0.8 +scaleX(new Date(data.year,0)) )
.attr('y', data =>scaleY(data['month']-1))
.attr('fill',data => scaleLegendColor(baseTemp - data['variance']))

d3.selectAll('.cell')
.style('stroke','black')
.style('stroke-width','0.20px')

d3.select('#app')
.append('svg')
.attr('id','legend')
.attr('width',graph.widthLegend)
.attr('height', graph.heightLegend)

d3.select('#legend')
.append('g')
.attr('id','x-axis-legend')
.attr('transform', `translate(${graph.marginX},${12})`)
.call(d3.axisBottom(scaleLegend).tickFormat(d3.format('.1f')))


d3.select('#legend')
.selectAll('rect')
.data(rectLegend)
.enter()
.append('rect')
.attr('width',scaleLegend.bandwidth())
.attr('height',10)
.attr('x',d =>  graph.marginX +scaleLegend(d))
.attr('y',0)
.attr('fill',d => scaleLegendColor(d))


d3.select('#app')
.append('div')
.attr('id','tooltip')
.attr('data-year','')
.attr('hidden','true')
.style('background-color','rgba(0,0,0,0.50)')
.style('color','white')
.style('font-size','17px')
.style('padding','10px')
.style('border-radius','5px')


d3.select('#tooltip')
.append('h6')
.attr('id','year-tooltip')

d3.select('#tooltip')
.append('h6')
.attr('id','variance-tooltip')

d3.select('#tooltip')
.append('h6')
.attr('id','temp-tooltip')

d3.select('#app')
.selectAll('.cell')
.on('mouseover', (e) => {

  let yearTooltip = document.querySelector('#year-tooltip')
  let varianceTooltip = document.querySelector('#variance-tooltip')
  let tempTooltip = document.querySelector('#temp-tooltip')
  let toolTip = document.querySelector('#tooltip')

  let dataYear = e.currentTarget.getAttribute('data-year')
  let dataVariance = e.currentTarget.getAttribute('data-variance')
  let dataTemp = e.currentTarget.getAttribute('data-temp')

  let dataMonth = e.currentTarget.getAttribute('data-month')
  let date = new Date()
  date.setMonth(dataMonth)
  let month = date.toLocaleString('en-gb',{month:'long'})

  yearTooltip.textContent = `${dataYear}-${month}`
  varianceTooltip.textContent = `Variance: ${dataVariance}`
  tempTooltip.textContent = `Temperature: ${dataTemp}`


  toolTip.setAttribute('data-year',dataYear)

  //tooltip pos 
  toolTip.removeAttribute('hidden')
  toolTip.style.position = 'absolute'
  toolTip.style.left = `${e.clientX+10}px`
  toolTip.style.top = `${e.clientY+10}px`

})


d3.select('#app')
.selectAll('.cell')
.on('mouseout',(e)=>{
  let toolTip = document.querySelector('#tooltip')
  toolTip.setAttribute('hidden','')
})
