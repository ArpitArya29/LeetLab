import React from 'react'
import { useParams } from 'react-router-dom'

const ProblemPage = () => {
    const {id} = useParams();
  return (
    <div>
      Problem id : {id}
    </div>
  )
}

export default ProblemPage
