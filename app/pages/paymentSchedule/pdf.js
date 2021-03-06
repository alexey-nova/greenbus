export default {
  create (logo, model, getUser, $dateFormat, statuses) {
    let pdf = {}
    let content = [
      { image: logo, margin: [150, 10, 0, 0] },
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
                text: 'ПЛАТЕЖНЫЙ КАЛЕНДАРЬ №' + model.id,
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
      },
      {
        table: {
          widths: [250, '*'],
          headerRows: 1,
          body: [
            ['', ''],
            ['', ''],
            ['', ''],
            [
              {
                text: 'Наименование поставщика:',
                style: 'tr'
              },
              {
                text: model.provider,
                style: 'tr'
              }
            ],
            [
              {
                text: 'Контракт №/Дата:',
                style: 'tr'
              },
              {
                text: model.contractNo,
                style: 'tr'
              }
            ],
            [
              {
                text: 'Описание услуг:',
                style: 'tr'
              },
              {
                text: model.comment,
                style: 'tr'
              }
            ],
            [
              {
                text: 'Общая сумма контракта/инвойса:',
                style: 'tr'
              },
              {
                text: model.totalAmount,
                style: 'tr'
              }
            ],
            [
              {
                text: 'Сумма предоплаты:',
                style: 'tr'
              },
              {
                text: model.prepayment,
                style: 'tr'
              }
            ]
          ]
        },
        layout: 'headerLineOnly'
      }
    ]

    let u = _.map(model.to, m => {
      let date = m.answer !== 'undefined' ? ' ' + $dateFormat(m.updatedAt, 'd mmm yyyy, hh:MM') : ''
      return [
        {
          text: getUser(m.user).position,
          style: 'tr'
        },
        {
          text: getUser(m.user).fullname,
          style: 'tr'
        },
        {
          text: statuses[m.answer] + date,
          style: 'tr'
        }
      ]
    })

    if (model.head) {
      let date = model.head.answer !== 'undefined' ? ' ' + $dateFormat(model.head.updatedAt, 'd mmm yyyy, hh:MM') : ''
      u.push([
        {
          text: getUser(model.head.user).position,
          style: 'tr'
        },
        {
          text: getUser(model.head.user).fullname,
          style: 'tr'
        },
        {
          text: statuses[model.head.answer] + date,
          style: 'tr'
        }
      ])
    }

    let users = {
      table: {
        widths: [120, '*', '*'],
        headerRows: 1,
        body: [
          ['', '', ''],
          [{text: 'Кому:', style: 'trHeader'}, '', ''],
          ...u,
          [{ text: '', margin: [0, 5] }, '', ''],
          // [
          //   {
          //     table: {
          //       widths: ['*', 400],
          //       body: [
          //         [
          //           {text: 'Комментарий:', style: 'trHeader2'},
          //           {text: model.comment, style: 'tr'}
          //         ],
          //       ]
          //     },
          //     layout: 'noBorders'
          //   }, '', ''
          // ],
          [
            {
              table: {
                widths: ['*', 400],
                body: [
                  [
                    {text: 'Дата:', style: 'trHeader2'},
                    {text: $dateFormat(model.createdAt, 'd mmm yyyy, hh:MM'), style: 'tr'}
                  ]
                ]
              },
              layout: 'noBorders'
            }, '', ''
          ]
        ]
      },
      layout: 'headerLineOnly'
    }

    let text = {
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [
          [''],
          [
            {
              text: '',
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
          [{text: 'Исполнитель:', style: 'trHeader'}, '', ''],
          [
            {
              text: getUser(model.from).position + ':',
              style: 'tr'
            },
            {
              text: getUser(model.from).fullname,
              style: 'tr'
            },
            ''
          ]
        ]
      },
      layout: 'noBorders'
    }

    content.push(users)
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
