import { useRef, useState, useEffect } from 'react'
import { Container, Col, Row, Button, Input, InputGroup, Label } from 'reactstrap'
import styles from '../css/post.module.scss'
import { useAsync } from 'react-async-hook'
import classname from 'classnames'
import { toast } from 'react-toastify'

const { ipcRenderer, clipboard } = require('electron')
const { templateSelect: selectStyle, areaTemplate: areaStyle } = styles

export default function GeneratePost () {
  const templates = useAsync(async () =>
    await ipcRenderer.invoke('getStore', 'templates')
  , [])

  const selectRef = useRef(null)
  const [fields, setFields] = useState({})
  const [fieldNames, setNames] = useState([])
  const [text, setText] = useState('')
  const [generated, setGenerated] = useState('')

  useEffect(() => {
    setNames((text.match(/\{.+?\}/g) || []).filter((x, i, a) => a.indexOf(x) === i) || [])
  }, [text])

  useEffect(() => {
    let newText = text
    fieldNames.forEach(field => {
      newText = newText.split(field).join(fields[field])
    })
    setGenerated(newText)
  }, [text, fields, fieldNames])

  function saveTemplate () {
    ipcRenderer.invoke('setStore', `templates.${selectRef.current.value}`, text)
      .then(() => toast.success('Saved template succesfully!'))
      .catch(err => {
        console.log(err)
        toast.error('Failed to save template')
      })
  }

  return (
    <Container fluid className='p-4'>
      <Row>
        <Col>
          {templates.result && (
            <InputGroup>
              <select ref={selectRef} className={classname(selectStyle, 'mr-2 mt-2 mt-sm-0')}>
                {Object.keys(templates.result).map(name => <option key={name} value={name}>{name}</option>)}
              </select>
              <Button className='mx-2 mt-2 mt-sm-0' color='primary' onClick={() => setText(templates.result[selectRef.current.value])}>Load Template</Button>
              <Button className='mx-2 mt-2 mt-sm-0' color='primary' onClick={saveTemplate}>Save Template</Button>
            </InputGroup>
          )}
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col xs={12}>
          <textarea className={areaStyle} value={text} onChange={ev => setText(ev.target.value)} />
        </Col>
      </Row>
      Detected fields: {fieldNames.map(field => (
        <Row key={field} className='mt-2'>
          <Col xs={12}>
            <InputGroup>
              <Label>{field}:</Label>
              <Input
                className='ml-2'
                onChange={ev => {
                  const newFields = {}
                  Object.assign(newFields, fields)
                  newFields[field] = ev.target.value
                  setFields(newFields)
                }}
              />
            </InputGroup>
          </Col>
        </Row>
      ))}

      <Row className='mt-4'>
        <Col xs={12}>
        Generated post:
          <textarea className={areaStyle} value={generated} disabled />
        </Col>
        <Col>
          <Button className='' color='primary' onClick={() => { clipboard.writeText(generated); toast.dark('Post sent to clipboard!') }}>Send to clipboard</Button>
        </Col>
      </Row>
    </Container>
  )
}
