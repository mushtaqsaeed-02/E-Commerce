import streamlit as st
import requests

BASE_URL = "https://fuzzy-space-halibut-gxqx77xg9wr7fpwqp-3000.app.github.dev"


st.set_page_config(page_title="E-Commerce Admin", layout="wide")

st.title("E-Commerce Admin Panel")

menu = st.sidebar.selectbox(
    "Navigation",
    ["Dashboard", "Users", "Products", "Categories", "Vendors", "Reviews", "Orders", "Payments", "Custom Query"]
)

def get_data(endpoint):
    try:
        res = requests.get(f"{BASE_URL}/{endpoint}")
        return res.json()
    except:
        return []

if menu == "Dashboard":
    st.header("Dashboard")

    users = get_data("users")
    products = get_data("products")
    vendors = get_data("vendors")
    orders = get_data("orders")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Users", len(users))
    col2.metric("Products", len(products))
    col3.metric("Vendors", len(vendors))
    col4.metric("Orders", len(orders))

    st.subheader("Charts")

    if users and vendors:
        st.bar_chart({"Users": [len(users)], "Vendors": [len(vendors)]})

    if products:
        cat_count = {}
        for p in products:
            cid = str(p.get("category_id"))
            cat_count[cid] = cat_count.get(cid, 0) + 1
        st.bar_chart(cat_count)

    if orders:
        status_count = {}
        for o in orders:
            s = o.get("status", "Unknown")
            status_count[s] = status_count.get(s, 0) + 1
        st.bar_chart(status_count)

elif menu == "Users":
    st.header("Users")

    action = st.selectbox("Action", ["View", "Add", "Update", "Delete"])

    if action == "View":
        users = get_data("users")

        user_id_filter = st.text_input("Filter by User ID")
        role_filter = st.text_input("Filter by Role ID")

        filtered = users

        if user_id_filter:
            filtered = [u for u in filtered if str(u["id"]) == user_id_filter]

        if role_filter:
            filtered = [u for u in filtered if str(u.get("role_id")) == role_filter]

        st.dataframe(filtered)

    if action == "Add":
        name = st.text_input("Full Name")
        email = st.text_input("Email")
        password = st.text_input("Password")
        phone = st.text_input("Phone")
        role_id = st.number_input("Role ID", 1, 10)

        if st.button("Create"):
            requests.post(f"{BASE_URL}/users", json={
                "full_name": name,
                "email": email,
                "password": password,
                "phone": phone,
                "role_id": role_id
            })
            st.success("User Added")

    if action == "Update":
        uid = st.number_input("User ID", 1, 1000)
        name = st.text_input("Full Name")
        email = st.text_input("Email")
        password = st.text_input("Password")
        phone = st.text_input("Phone")
        role_id = st.number_input("Role ID", 1, 10)

        if st.button("Update"):
            requests.put(f"{BASE_URL}/users/{uid}", json={
                "full_name": name,
                "email": email,
                "password": password,
                "phone": phone,
                "role_id": role_id
            })
            st.success("User Updated")

    if action == "Delete":
        uid = st.number_input("User ID", 1, 1000)
        if st.button("Delete"):
            requests.delete(f"{BASE_URL}/users/{uid}")
            st.success("User Deleted")

elif menu == "Products":
    st.header("Products")

    action = st.selectbox("Action", ["View", "Add", "Update", "Delete"])

    if action == "View":
        products = get_data("products")

        cat_filter = st.text_input("Category ID")
        vendor_filter = st.text_input("Vendor ID")

        filtered = products

        if cat_filter:
            filtered = [p for p in filtered if str(p.get("category_id")) == cat_filter]

        if vendor_filter:
            filtered = [p for p in filtered if str(p.get("vendor_id")) == vendor_filter]

        st.dataframe(filtered)

    if action == "Add":
        name = st.text_input("Product Name")
        desc = st.text_input("Description")
        price = st.number_input("Price")
        stock = st.number_input("Stock")
        cat = st.number_input("Category ID", 1, 100)
        vendor = st.number_input("Vendor ID", 1, 100)

        if st.button("Add"):
            requests.post(f"{BASE_URL}/products", json={
                "product_name": name,
                "description": desc,
                "price": price,
                "stock": stock,
                "category_id": cat,
                "vendor_id": vendor
            })
            st.success("Product Added")

elif menu == "Categories":
    st.header("Categories")

    action = st.selectbox("Action", ["View", "Add", "Update", "Delete"])

    if action == "View":
        data = get_data("categories")
        search = st.text_input("Search Category")

        if search:
            data = [c for c in data if search.lower() in c["category_name"].lower()]

        st.dataframe(data)

    if action == "Add":
        name = st.text_input("Category Name")
        if st.button("Add"):
            requests.post(f"{BASE_URL}/categories", json={"category_name": name})
            st.success("Added")

elif menu == "Vendors":
    st.header("Vendors")

    action = st.selectbox("Action", ["View", "Add", "Update", "Delete"])

    if action == "View":
        data = get_data("vendors")
        search = st.text_input("Search Vendor")

        if search:
            data = [v for v in data if search.lower() in v["vendor_name"].lower()]

        st.dataframe(data)

    if action == "Add":
        name = st.text_input("Vendor Name")
        email = st.text_input("Email")
        phone = st.text_input("Phone")

        if st.button("Add"):
            requests.post(f"{BASE_URL}/vendors", json={
                "vendor_name": name,
                "contact_email": email,
                "phone": phone
            })
            st.success("Added")

elif menu == "Reviews":
    st.header("Reviews")

    action = st.selectbox("Action", ["View", "Add", "Update", "Delete"])

    if action == "View":
        data = get_data("reviews")

        rating_filter = st.text_input("Filter Rating")
        product_filter = st.text_input("Filter Product ID")

        filtered = data

        if rating_filter:
            filtered = [r for r in filtered if str(r.get("rating")) == rating_filter]

        if product_filter:
            filtered = [r for r in filtered if str(r.get("product_id")) == product_filter]

        st.dataframe(filtered)

elif menu == "Orders":
    st.header("Orders")

    data = get_data("orders")

    status_filter = st.selectbox("Status Filter", ["All", "Pending", "Shipped", "Delivered"])

    if status_filter != "All":
        data = [o for o in data if o.get("status") == status_filter]

    st.dataframe(data)

elif menu == "Payments":
    st.header("Payments")

    data = get_data("payments")

    status_filter = st.selectbox("Status Filter", ["All", "Paid", "Pending"])

    if status_filter != "All":
        data = [p for p in data if p.get("payment_status") == status_filter]

    st.dataframe(data)

elif menu == "Custom Query":
    st.header("Run Custom Query")

    query = st.text_area("Enter Query")

    if st.button("Run Query"):
        try:
            res = requests.post(f"{BASE_URL}/query", json={"query": query})
            data = res.json()
            st.dataframe(data)
        except Exception as e:
            st.error(str(e))
