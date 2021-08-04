module.exports = {
  plugin: (schema) => {
    const toUpperCamel = (str) => {
      return str.replace(/^./, (c) => c.toUpperCase());
    };

    const text = schema.extensions.sources
      .map((source) => source.body)
      .join('\n');

    const oneline = text.replace(/\n/g, '');

    const typeLines = oneline
      .match(/type (.*?)}/g)
      .filter((line) => !line.match(/type [Mutation]/));

    const mutationLine = oneline
      .match(/type (.*?)}/g)
      .find((line) => line.match(/type [Mutation]/));

    /*
      [{
        TypeName: { name: 'TypeName', props: [
          {
            name: 'propName',
            name: 'PropType(!)',
          }
        ]}
      }]
    */
    const types = typeLines.reduce((obj, line) => {
      const matches = line.match(/type (.*) { {2}(.*)}/);
      const propLines = matches[2].split('  ');
      const props = propLines.map((l) => {
        const match = l.match(/(.*): (.*)/);
        return {
          name: match[1],
          type: match[2],
        };
      });
      const name = matches[1];
      return { ...obj, [name]: { name, props } };
    }, {});

    /*
      [
        {
          "name": "mutationName",
          "props": [
            {
              "name": "propName",
              "type": "PropType(!)"
            },
          ],
          "returnType": "ReturnType(!)"
        },
      ]
    */
    const matches = mutationLine
      ? [...mutationLine.matchAll(/([^\s]*?\(.*?\)): ([^\s}$]*)/g)]
      : [];
    let mutations = matches.map((match) => {
      const [, name, propsStr] = [...match[1].match(/(.*?)\((.*)\)/)];
      const propStrs = propsStr.split(', ');
      const props = propStrs.map((str) => {
        const [propName, propType] = str.split(': ');
        return { name: propName, type: propType };
      });
      return {
        name,
        props,
        returnType: match[2],
      };
    });
    // No props.
    const matches2 = mutationLine
      ? [...mutationLine.matchAll(/ {2}([^\s:]*?): ([^\s}$]*)/g)]
      : [];
    const mutations2 = matches2
      .filter((match) => !match[1].includes('('))
      .map((match) => {
        return {
          name: match[1],
          props: null,
          returnType: match[2],
        };
      });

    mutations = [...mutations, ...mutations2];

    const queries = types.Query;

    const queriesText = queries.props
      .map(({ name, type }) => {
        let typeName = type.replace(/^\[/, '');
        typeName = typeName.replace(/!$/, '');
        typeName = typeName.replace(/]$/, '');
        typeName = typeName.replace(/!$/, '');
        let props = '';
        if (types[typeName]) {
          props = `{
            ${types[typeName].props
              .map((prop) => {
                return prop.name;
              })
              .join(' ')}
          }`;
        }

        let queryName = name;
        let queryParams = '';
        const match = name.match(/(.*)\((.*)\)/);
        if (match) {
          [, queryName] = match;
          if (match[2]) {
            queryParams += '(';
            queryParams += match[2]
              .split(', ')
              .map((param) => `$${param}`)
              .join(', ');
            queryParams += ')';
          }
        }

        let queryParams2 = '';
        if (match && match[2]) {
          queryParams2 += '(';
          queryParams2 += match[2]
            .split(', ')
            .map((v) => v.split(': ')[0])
            .map((param) => `${param}: $${param}`)
            .join(', ');
          queryParams2 += ')';
        }

        return `
          query ${toUpperCamel(queryName)}${queryParams} {
            ${queryName}${queryParams2}${props}
          }
        `;
      })
      .join('\n');

    const mutationsText = mutations
      .map((mutation) => {
        let props = '';
        let returnTypeName = mutation.returnType.replace(/^\[/, '');
        returnTypeName = returnTypeName.replace(/!$/, '');
        returnTypeName = returnTypeName.replace(/]$/, '');
        returnTypeName = returnTypeName.replace(/!$/, '');
        const returnType = types[returnTypeName];
        if (returnType) {
          props = `{
            ${returnType.props.map((type) => type.name).join(' ')}
          }`;
        }

        let parameters = '';
        if (mutation.props) {
          parameters += '(';
          parameters += mutation.props
            .map((prop) => {
              return `$${prop.name}: ${prop.type}`;
            })
            .join(', ');
          parameters += ')';
        }

        let args = '';
        if (mutation.props) {
          args += '(';
          args += mutation.props
            .map((prop) => {
              return `${prop.name}: $${prop.name}`;
            })
            .join(', ');
          args += ')';
        }

        return `
          mutation ${toUpperCamel(mutation.name)}${parameters} {
            ${mutation.name}${args}${props}
          }
        `;
      })
      .join('\n');

    return [queriesText, mutationsText].join('\n');
  },
};
