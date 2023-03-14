import React, { FunctionComponent, useEffect, useState } from "react"
import { RetrospectiveInstance } from "@uniscale-sdk/ActorScene-SuperRetro/sdk/FeedbackBros/SuperRetro/SuperRetro/Retrospective/RetrospectiveInstance"
export const RetrospectView: FunctionComponent = () => {
  const [retrospectList, setRetrospectList] = useState<RetrospectiveInstance[]>([])

  const getAllRetrospectiveInstances = async () => {
    const data: RetrospectiveInstance[] = await Promise.resolve([
      {
        retrospectiveInstanceIdentifier: "14f255c4-eddd-433d-b316-fdd67093503a",
        name: "Hackathon-March",
      },
    ])
    setRetrospectList(data)
  }

  useEffect(() => {
    getAllRetrospectiveInstances()
  }, [])
  return (
    <div>
      <h1>retrospectView</h1>
      <ul>
        {retrospectList.map((r) => (
          <li key={r.retrospectiveInstanceIdentifier}>{r.name}</li>
        ))}
      </ul>
    </div>
  )
}
