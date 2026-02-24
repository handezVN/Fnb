#!/usr/bin/env bash
# Seed data via Admin API (curl). Cần chạy migration + seed user trước: npm run migrate && npm run seed
# Usage: ./scripts/seed-data-curl.sh [base_url]
# Example: ./scripts/seed-data-curl.sh http://localhost:3000

set -e
BASE="${1:-http://localhost:3000}/api/v1"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASS="admin123"

# Parse JSON field from stdin (Node). Usage: echo '{"a":1}' | json a
json() { node -e "const d=require('fs').readFileSync(0,'utf8'); const j=JSON.parse(d); const k=process.argv[2]; console.log((j && k && j[k]) !== undefined ? j[k] : '');" "$1"; }

echo "1. Login..."
RES=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}")
TOKEN=$(echo "$RES" | jq -r '.access_token')
if [ -z "$TOKEN" ]; then
  echo "Login failed. Run: npm run migrate && npm run seed"
  echo "$RES" | head -5
  exit 1
fi
echo "   OK"

echo "2. Create stores..."
S1=$(curl -s -X POST "$BASE/admin/stores" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Cơm tấm Cali","address":"123 Nguyễn Huệ, Q1, TP.HCM","phone":"028 1234 5678","is_open":true}' | json "id")
S2=$(curl -s -X POST "$BASE/admin/stores" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Phở 24","address":"456 Lê Lợi, Q3, TP.HCM","phone":"028 8765 4321","is_open":true}' | json "id")
echo "   Store 1: $S1"
echo "   Store 2: $S2"

echo "3. Create users (staff)..."
curl -s -X POST "$BASE/admin/users" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"email\":\"staff1@store.com\",\"full_name\":\"Nguyễn Văn A\",\"role\":\"STAFF\",\"store_id\":\"$S1\",\"password\":\"staff123\"}" > /dev/null
curl -s -X POST "$BASE/admin/users" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"email\":\"manager2@store.com\",\"full_name\":\"Trần Thị B\",\"role\":\"STORE_MANAGER\",\"store_id\":\"$S2\",\"password\":\"manager123\"}" > /dev/null
echo "   OK (staff1@store.com / staff123, manager2@store.com / manager123)"

echo "4. Create menus..."
M1=$(curl -s -X POST "$BASE/admin/menus" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"store_id\":\"$S1\",\"name\":\"Thực đơn chính\",\"is_active\":true}" | json "id")
M2=$(curl -s -X POST "$BASE/admin/menus" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"store_id\":\"$S2\",\"name\":\"Thực đơn chính\",\"is_active\":true}" | json "id")
echo "   Menu 1: $M1, Menu 2: $M2"

echo "5. Create categories..."
C1=$(curl -s -X POST "$BASE/admin/categories" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"menu_id\":\"$M1\",\"name\":\"Cơm\",\"sort_order\":0}" | json "id")
C2=$(curl -s -X POST "$BASE/admin/categories" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"menu_id\":\"$M1\",\"name\":\"Đồ uống\",\"sort_order\":1}" | json "id")
C3=$(curl -s -X POST "$BASE/admin/categories" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"menu_id\":\"$M2\",\"name\":\"Phở\",\"sort_order\":0}" | json "id")
echo "   Categories: $C1, $C2, $C3"

echo "6. Create products..."
curl -s -X POST "$BASE/admin/products" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"category_id\":\"$C1\",\"name\":\"Cơm sườn\",\"description\":\"Cơm sườn nướng\",\"price\":45000,\"is_available\":true,\"sort_order\":0}" > /dev/null
curl -s -X POST "$BASE/admin/products" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"category_id\":\"$C1\",\"name\":\"Cơm gà\",\"description\":\"Cơm gà xối mỡ\",\"price\":40000,\"is_available\":true,\"sort_order\":1}" > /dev/null
curl -s -X POST "$BASE/admin/products" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"category_id\":\"$C2\",\"name\":\"Trà đá\",\"price\":5000,\"is_available\":true,\"sort_order\":0}" > /dev/null
curl -s -X POST "$BASE/admin/products" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"category_id\":\"$C2\",\"name\":\"Sinh tố bơ\",\"price\":25000,\"is_available\":true,\"sort_order\":1}" > /dev/null
curl -s -X POST "$BASE/admin/products" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"category_id\":\"$C3\",\"name\":\"Phở bò\",\"description\":\"Phở bò tái\",\"price\":55000,\"is_available\":true,\"sort_order\":0}" > /dev/null
curl -s -X POST "$BASE/admin/products" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"category_id\":\"$C3\",\"name\":\"Phở gà\",\"price\":50000,\"is_available\":true,\"sort_order\":1}" > /dev/null
echo "   OK"

echo "Done. Data đã được tạo qua Admin API."
