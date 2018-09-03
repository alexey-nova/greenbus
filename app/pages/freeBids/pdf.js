export default {
  create (logo, model, users, $dateFormat, positions, statuses) {
    let from = positions.find(item => item._id === users.find(u => u._id === model.createdBy).position)
    from = from ? from.name : '---'
    let pdf = {}
    let content = [
      { image: logo, margin: [150, 10, 0, 0], style: { alignment: 'center' } },
      { text: '', margin: [0, 20] },
      { table: { widths: ['*'], headerRows: 1, body: [[''], ['']] }, layout: 'headerLineOnly' },
      {
        table: {
          widths: [10, '*', 10],
          headerRows: 1,
          body: [
            [
              '',
              {
                text: 'СЛУЖЕБНАЯ ЗАПИСКА №' + model.id,
                margin: [0, 20],
                style: {
                  fontSize: 18
                },
                alignment: 'center'
              },
              ''
            ]
          ]
        },
        layout: 'headerLineOnly'
      }
    ]

    let u = _.map(model.to, m => {
      let date = m.date ? ` ${$dateFormat(m.date, 'd mmm yyyy, HH:MM')}` : ''
      return [
        {
          text: positions.find(item => item._id === users.find(user => user._id === m.user).position).name,
          style: 'tr'
        },
        {
          text: users.find(item => item._id === m.user).fullname,
          style: 'tr'
        },
        {
          text: m.status === 'confirmed' ? `Согласовал ${date}` : m.status === 'declined' ? `Отклонил ${date}` : '---',
          style: 'tr'
        }
      ]
    })

    let tableUsers = {
      table: {
        widths: [120, '*', '*'],
        headerRows: 1,
        body: [
          ['', '', ''],
          [{ text: 'Исполнители:', style: 'trHeader' }, '', ''],
          ...u,
          [{ text: '', margin: [0, 5] }, '', ''],
          [
            {
              table: {
                widths: [100, 400],
                body: [
                  [
                    { text: 'Тема:', style: 'trHeader2' },
                    { text: model.name, style: 'tr' }
                  ],
                  [
                    { text: 'Срок сдачи:', style: 'trHeader2' },
                    { text: $dateFormat(model.deadline, 'dd mmm yyyy'), style: 'tr' }
                  ]
                ]
              },
              layout: 'noBorders'
            }, '', ''
          ]
          // [
          //   {
          //     table: {
          //       widths: ['*', 400],
          //       body: [
          //         [
          //           {text: 'Дата:', style: 'trHeader2'},
          //           {text: $dateFormat(model.createdAt, 'd mmm yyyy, HH:MM'), style: 'tr'}
          //         ],
          //       ]
          //     },
          //     layout: 'noBorders'
          //   }, '', ''
          // ],
        ]
      },
      layout: 'headerLineOnly'
    }

    function htmlToText (text) {
      let elem = document.createElement('div')
      elem.innerHTML = text
      return elem.innerText
    }

    let text = {
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [
          [''],
          [
            {
              text: htmlToText(model.description).split('').join('\u200b'),
              margin: [0, 10, 0, 30],
              style: 'tr'
            }
          ]
        ]
      },
      layout: 'headerLineOnly'
    }
    let footer = {
      table: {
        widths: [120, '*', '*'],
        headerRows: 1,
        body: [
          [{ text: 'От кого:', style: 'trHeader' }, '', ''],
          [
            {
              text: from,
              style: 'tr'
            },
            {
              text: users.find(item => item._id === model.createdBy).fullname,
              style: 'tr'
            },
            ''
          ]
        ]
      },
      layout: 'noBorders'
    }

    content.push(tableUsers)
    content.push(text)
    content.push(footer)

    let styles = {
      trHeader: {
        fontSize: 10,
        margin: [0, 15, 0, 5],
        bold: true
      },
      trHeader2: {
        fontSize: 10,
        bold: true
      },
      trHeader3: {
        fontSize: 10,
        margin: [0, 5, 0, 0],
        bold: true
      },
      tr: {
        fontSize: 10,
        margin: [0, 0, 0, 5]
      }
    }

    pdf.content = content
    pdf.styles = styles

    return pdf
  }
}
