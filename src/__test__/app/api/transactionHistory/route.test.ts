import { GET } from "@/app/api/transactionHistory/route";

interface Transaction {
  date: string;
  referenceId: string;
  to: string;
  recipientReference: string;
  type: string;
  amount: number;
}

describe("GET /api/transactionHistory", () => {
  it("should return a list of transactions", async () => {
    const res = await GET();
    const json: Transaction[] = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json).toHaveLength(5);

    json.forEach((item: Transaction) => {
      expect(item).toHaveProperty("date");
      expect(item).toHaveProperty("referenceId");
      expect(item).toHaveProperty("to");
      expect(item).toHaveProperty("recipientReference");
      expect(item).toHaveProperty("type");
      expect(item).toHaveProperty("amount");
    });

    expect(json[0].referenceId).toBe("12345678");
    expect(typeof json[0].amount).toBe("number");
  });
});
