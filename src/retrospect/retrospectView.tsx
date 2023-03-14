import React, { FunctionComponent, useEffect, useState } from "react"
import { RetrospectiveInstance } from "@uniscale-sdk/ActorScene-SuperRetro/sdk/FeedbackBros/SuperRetro/SuperRetro/Retrospective/RetrospectiveInstance"
import { ActorInScene, GatewayRequest, Platform } from "@uniscale-sdk/ActorScene-SuperRetro"
import { NewRetrospective } from "@uniscale-sdk/ActorScene-SuperRetro/sdk/FeedbackBros/SuperRetro_1_0/Functionality/ServiceToSolution/AgentInPrivate/SuperRetro/ManageRetrospectives_bundle/IWantToBeAbleToAddNewRetrospective_group/NewRetrospective"
// import { randomUUID } from "crypto"

export const RetrospectView: FunctionComponent = () => {
  const [retrospectList, setRetrospectList] = useState<RetrospectiveInstance[]>([])

  const getAllRetrospectiveInstances = async () => {
    // const data = await fetch("http://10.10.31.182:8080/retro", { method: "GET" }).then((res) => res.json())
    const session = await Platform.builder()
      .withInterceptors((i) =>
        i.interceptPattern("*", async (input, ctx) => {
          const json = GatewayRequest.from(input, ctx)
          return fetch("http://localhost:5295/retro", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
          }).then((res) => res.json())
        })
      )
      .build()

    const caller = session
      .asSolution("2caceb43-3989-4740-b4d4-29e4ee5e5d3d")
      .withDataTenant("2caceb43-3989-4740-b4d4-29e4ee5e5d3d")
      .withTransactionId("2caceb43-3989-4740-b4d4-29e4ee5e5d3d")
      .withLocale("en-GB")

    const ret = await caller.request(NewRetrospective.with({ name: "Hackathon-March" }))
    console.log(ret)
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
