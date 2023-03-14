// import { Item, ShoppingList } from "@uniscale-sdk/ActorCharacter-TeamA/sdk/UniscaleModellers/TeamA_1_0/payloads"
// import { ShoppingList } from "@uniscale-sdk/ActorCharacter-TeamA/sdk/UniscaleModellers/TeamA_1_0/payloads"
import React, { FormEvent, FunctionComponent, useEffect, useState } from "react"
import "./App.css"

type Item = {
  itemIdentifier: string
  name: string
  categories: string[]
}
type ShoppingList = {
  shoppingListIdentifier: string
  name: string
  items: { itemIdentifier: string; name: string; quantity?: number; purchased?: boolean }[]
}
// const MOCK_DATA = [
//   {
//     id: "1",
//     name: "ShoppingList 1",
//     items: [],
//   },
//   {
//     id: "2",
//     name: "ShoopingList 2",
//     items: [],
//   },
// ]
export const ShoppingListView: FunctionComponent = () => {
  const [list, setList] = useState<ShoppingList[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [selectedShoppingList, setSelectedShoppingList] = useState()

  const getAllShoppingList = async () => {
    const data: ShoppingList[] = await fetch("http://10.10.31.182:8080/shoppinglist", { method: "GET" }).then((res) => res.json())
    setList(data)
  }
  const getAllItems = async () => {
    const data: Item[] = await fetch("http://10.10.31.182:8080/items/7c3f2752-60e1-4e65-ae65-b2011fc449d8", { method: "GET" }).then((res) => res.json())
    setItems(data)
  }
  const addItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(e)
    const pName = (e.target as any).name
    const pCategories = (e.target as any).categories
    const pQuantity = (e.target as any).quantity

    const newProduct = { itemIdentifier: items.length + 1 + "", name: pName.value as string, categories: pCategories.value.split(", ") }

    try {
      const resp = await fetch(`http://10.10.31.182:8080/shoppinglist/${selectedShoppingList}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ quantity: pQuantity.value, name: pName.value, shoppingListIdentifier: selectedShoppingList }]),
      })
      // const itemId = await fetch(`http://10.10.31.182:8080/items`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify([{ name: pName.value, categories: pCategories.value.split(", ") }]),
      // })
      if (resp) {
        getAllShoppingList()
        getAllItems()
      }
    } catch (e) {
      throw new Error()
    }

    setItems([...items, newProduct])
  }
  const createShoppingList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = (e.target as any).name
    const resp = await fetch("http://10.10.31.182:8080/shoppinglist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: input.value }),
    }).then((res) => res.json())

    setList([...list, { shoppingListIdentifier: resp, name: input.value, items: [] }])
    input.value = ""
  }
  useEffect(() => {
    getAllShoppingList()
    getAllItems()
  }, [])
  return (
    <div>
      <h1>ShoppingLists</h1>
      <div style={{ display: "flex", margin: "8px" }}>
        <form onSubmit={createShoppingList}>
          <input type="text" name="name" placeholder="write shoppinglist name" />
          <button type="submit">Create shoppinglist</button>
        </form>
      </div>
      <ul>
        {list.map((item) => (
          <li key={item.shoppingListIdentifier}>
            {item.name}
            <ul>
              {item.items?.map((i) => (
                <li key={i.itemIdentifier}>
                  {items.find((item) => item.itemIdentifier === i.itemIdentifier)?.name}-{i.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <hr />
      <h1>Products</h1>
      <div style={{ display: "flex", margin: "8px" }}>
        <form onSubmit={addItem} method="POST">
          <input type="text" name="name" placeholder="item name" required />
          <input type="text" name="categories" placeholder="categories" required />
          <input type="number" name="quantity" placeholder="quantity" required />
          <select value={selectedShoppingList} onChange={(e) => setSelectedShoppingList(e.target.value as any)}>
            <option>Select shopping list</option>
            {list.map((item) => (
              <option value={item.shoppingListIdentifier}>{item.name}</option>
            ))}
          </select>
          <button type="submit">Add items</button>
        </form>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.itemIdentifier}>
            {item.name} - {item.categories?.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  )
}
