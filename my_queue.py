class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class Queue:
    """First in, first out. Enqueue at the rear, dequeue from the front."""

    def __init__(self):
        self.front = None
        self.rear = None

    def is_empty(self):
        return self.front is None

    def enqueue(self, data):
        new_node = Node(data)
        if self.rear:
            self.rear.next = new_node
        else:
            self.front = new_node
        self.rear = new_node

    def dequeue(self):
        if self.front is None:
            return None
        removed = self.front
        self.front = self.front.next
        if self.front is None:
            self.rear = None
        removed.next = None
        return removed.data

    def peek(self):
        if self.front:
            return self.front.data
        return None

    def print_queue(self):
        if self.front is None:
            print("Queue is empty")
        else:
            current = self.front
            print("Queue elements (front → rear):")
            while current:
                print(current.data)
                current = current.next


if __name__ == "__main__":
    q = Queue()
    q.print_queue()

    q.enqueue(10)
    q.enqueue(20)
    q.enqueue(30)
    q.print_queue()

    print("Front element:", q.peek())
    print("Dequeued:", q.dequeue())
    print("Dequeued:", q.dequeue())
    q.print_queue()

    print("Dequeued:", q.dequeue())
    print("Dequeued from empty queue:", q.dequeue())
    print("Peek on empty queue:", q.peek())
    q.print_queue()
