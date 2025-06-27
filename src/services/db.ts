import Dexie, { Table } from "dexie";
import { Cookies } from "react-cookie";
import { OrderBookItem } from "../types/order";
// import {VolumeBook} from "../types/candle";

export class ExchangeDB extends Dexie {
  book!: Table<OrderBookItem, number>;
  // volume!: Table<VolumeBook, number>;

  constructor() {
    super("ExchangeDB");
    this.version(1.21).stores({
      book: "&id, candleNumber, userId, direction, [direction+candleNumber]",
      volume: "++id, &candleNumber",
    });
  }

  cleanCandle(candleNumber: number) {
    return this.transaction("rw", this.book, () => {
      this.book.where({ candleNumber }).delete();
      // this.volume.where({candleNumber}).delete();
    });
  }
}

export const db = new ExchangeDB();

export function resetDatabase() {
  return db.transaction("rw", [db.book], async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });
}

export function saveAccountId(
  keyAccountId: string,
  accountId: string,
  message?: string,
  reloadPage?: boolean
) {
  const authCookies = new Cookies(null, {
    domain: import.meta.env.VITE_DOMAIN_AUTH,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  authCookies.set(keyAccountId, accountId);
  if (reloadPage) {
    console.log("RELOAD APP");
    // window.location.reload();
  }
}
