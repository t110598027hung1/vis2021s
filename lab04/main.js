window.onload = () => {
           d3.csv('data.csv', data => {
                console.log(data)
                const table = d3.select('body').append('table')

                const thead = table.append("thead").append("tr")
                thead.selectAll('th')
                     .data(Object.keys(data[0]))
                     .enter()
                     .append('th')
                     .text(d => d)
                const tbody = table.append('tbody')

                const rows = tbody.selectAll('tr')
                                  .data(data)
                                  .enter()
                                  .append('tr')
                
                const cell = rows.selectAll('td')
                                 .data(d => Object.keys(d).map((e,i) => (i==4 || i == 5) ? (d[e] == '0' || d[e] == '1' ? !!parseInt(d[e]): d[e]) : d[e]))                               
                                 .enter()
                                 .append('td')
                                 .text(d => typeof d != 'boolean' ? d : '')
                                 .append('img')
                                 .filter(d => typeof d == 'boolean')
                                 .attr('src', d =>  d === true ? './92.png' : './93.png')
                                 .attr("width",  '100px')
                                 .attr("height", '100px')
            })
}