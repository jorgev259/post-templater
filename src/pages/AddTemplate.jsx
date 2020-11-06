import { useRef, useState } from 'react'
import { Container, Col, Row, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { templateText } from '../css/template.module.scss'
import { toast } from 'react-toastify'
const { ipcRenderer } = require('electron')

export default function AddTemplate () {
  const [template, setTemplate] = useState('')
  const nameRef = useRef(null)

  function submitTemplate () {
    ipcRenderer.invoke('setStore', `templates.${nameRef.current.value}`, template)
      .then(() => {
        toast.success('Saved template succesfully!')
        nameRef.current.value = ''
        setTemplate('')
      })
      .catch(err => {
        console.log(err)
        toast.error('Failed to save template')
      })
  }

  return (
    <Container fluid className='p-4'>
      <Row>
        <Col>
          <InputGroup>
            <Input innerRef={nameRef} placeholder='Template Name' />
            <InputGroupAddon addonType='append'>
              <Button color='primary' onClick={submitTemplate}>Save Template</Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col xs={8}>
          <textarea className={templateText} onChange={ev => setTemplate(ev.target.value)} />
        </Col>
        <Col xs={4}>Detected fields: {(template.match(/\{.+?\}/g) || []).filter((x, i, a) => a.indexOf(x) === i).join(' - ')}</Col>
      </Row>
    </Container>
  )
}
