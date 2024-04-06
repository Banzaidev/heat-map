import './style.css'
import * as d3 from 'd3'


const data = await d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
const baseTemp = data['baseTemperature']
const monthlyVariance = data['monthlyVariance']
const graph = {
  'width': 900,
  'height': 600,
  'rect-w': 2
  
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
.domain([d3.min(monthlyVariance, d=> new Date().setFullYear(d['year'])), d3.max(monthlyVariance, d => new Date().setFullYear(d['year']))])
.range([0, graph.width-70])

const scaleY = d3.scaleTime()
.domain([d3.min(monthlyVariance, d=> new Date().setMonth(d['month'])), d3.max(monthlyVariance, d=> new Date().setMonth(d['month']))])
.range([graph.height - 50,0])


d3.select('svg')
.append('g')
.attr('id','x-axis')
.attr('transform', `translate(${70}, ${graph.height - 50})`)
.call(d3.axisBottom(scaleX))


d3.select('svg')
.append('g')
.attr('id', 'y-axis')
.attr('transform', `translate(${70}, 0)`)
.call(d3.axisLeft(scaleY).tickFormat(d3.timeFormat('%B')))


