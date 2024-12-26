import './style.css'
import * as d3 from 'd3'


const data = await d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
const baseTemp = data['baseTemperature']
const monthlyVariance = data['monthlyVariance']
const graph = {
  'width': 900,
  'height': 600,
  'rect-w': 2,
  'marginX': 70,
  'marginY': 50,
  'widthLegend': 550
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
  let c = new Date()
  c.setMonth(t)
  let month = c.toLocaleString('en-gb',{month:'long'})
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
.attr('width','1')
.attr('height','40')
.attr('x',data => graph.marginX+ 0.8 +scaleX(new Date().setFullYear(data.year)) )
.attr('y', data =>scaleY(data['month']-1))




/* 
d3.select('#app')
.append('svg')
.attr('id', 'legend')
.attr('width', graph.width)
.attr('height', 200)
.append('g')
.attr('transform', `translate(${graph.marginX}, ${100})`)
 */