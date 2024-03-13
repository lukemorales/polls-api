import { type PollId, type PollOptionId } from '../database/schema';

type Message = {
  pollOptionId: PollOptionId;
  score: number;
};

type Subscriber = (message: Message) => void;

type SubscribeOptions = {
  connectionId: string;
  subscriber: Subscriber;
};

type UnsubscribeOptions = {
  connectionId: string;
};

export class VotingPubSub {
  #channels: Map<string, Map<string, Subscriber>>;

  constructor() {
    this.#channels = new Map();
  }

  subscribe(pollId: PollId, { connectionId, subscriber }: SubscribeOptions) {
    let connections = this.#channels.get(pollId);

    if (connections) {
      return void connections.set(connectionId, subscriber);
    }

    connections = new Map([[connectionId, subscriber]]);

    this.#channels.set(pollId, connections);
  }

  unsubscribe(pollId: PollId, options: UnsubscribeOptions) {
    const subscribers = this.#channels.get(pollId);

    if (!subscribers) {
      return;
    }

    subscribers.delete(options.connectionId);
  }

  publish(pollId: PollId, message: Message) {
    const connections = this.#channels.get(pollId);

    if (!connections) {
      return void 0;
    }

    for (const subscription of connections.values()) {
      subscription(message);
    }
  }
}
