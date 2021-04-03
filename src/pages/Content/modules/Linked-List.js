export class Node {
    constructor(data, prev) {
        this.data = data;
        this.prev = prev;
        this.next = null;
    }
}

export class LinkedList{
    constructor(head = null) {
        this.head = head
    }

    size() {
        let count = 0; 
        let node = this.head;
        while (node) {
            count++;
            node = node.next
        }
        return count;
    }

    clear() {
        this.head = null;
    }

    getLast() {
        let lastNode = this.head;
        if (lastNode) {
            while (lastNode.next) {
                lastNode = lastNode.next
            }
        }
        return lastNode
    }

    getFirst() {
        return this.head;
    }

    map() {
        console.log("MAP")
        const res = [];
        let cursor = this.head;
        console.log("Cursor", cursor)
        while(cursor) {
            console.log("In While")
            res.push(cursor.data)
            console.log("Res", res)
            cursor = cursor.next;
        }
        return res;
    }

    insert(data) {
        this.head = new Node(data, null);
        console.log("Data coming in :", data)
        console.log("Data ref:", data.ref)

    }


}