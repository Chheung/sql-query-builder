export interface IQueryBuilder {
  selects: string[];
  table: string;
  joins?: string[];
  where?: string[] | { op: string; cond: string }[];
}

/**
 * Custom query builder
 * @param opts
 * @returns SQL RAW query string
 */
export const queryBuilder = (opts: IQueryBuilder): string => {
  const { selects, table, joins, where } = opts;
  let qry = "";

  // SELECT
  if (selects?.length) {
    qry = "SELECT " + selects.join(", ");
  } else {
    qry += "SELECT *";
  }

  // FROM
  if (!table.replace(/ /g, "")) throw { message: "FROM clause is required" };
  qry += " FROM " + table;

  // JOIN
  if (joins?.length) {
    qry += " " + joins.join(" ");
  }

  // WHERE
  if (where?.length) {
    qry += " WHERE ";
    for (const [i, w] of where.entries()) {
      if (i !== 0) {
        if (typeof w === "string") {
          qry += ` AND ${w}`;
        } else {
          qry += ` ${w.op} ${w.cond} `;
        }

        continue;
      }

      if (typeof w === "string") {
        qry += w;
      } else {
        qry += w.cond;
      }
    }
  }

  return qry;
};
