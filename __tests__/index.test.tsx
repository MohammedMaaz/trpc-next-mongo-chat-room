import { render, screen } from "@testing-library/react";
import Home from "~/pages/index";
import "@testing-library/jest-dom";
import { useInfiniteMsgList } from "../hooks/msg/useInfiniteMsgList";

type PartialReturnType<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => Partial<ReturnType<T>>;

// mock all hooks to avoid calling trpc client APIs in tests
let onEndReached: Function;
jest.mock("../hooks/common/useOnScrollEndReached.ts", () => ({
  useOnScrollEndReached: (_onEndReached: Function) => {
    //capture onEndReached to call later
    onEndReached = _onEndReached;
    return { ref: () => {} };
  },
}));
jest.mock("../hooks/msg/useHandleMsgSend.ts", () => ({
  useHandleMsgSend: () => ({}),
}));
jest.mock("../hooks/msg/useHandleMsgDelete.ts", () => ({
  useHandleMsgDelete: () => ({}),
}));
jest.mock("../hooks/msg/useInfiniteMsgList.ts");
const mockedUseInfiniteMsgList = useInfiniteMsgList as jest.MockedFunction<
  PartialReturnType<typeof useInfiniteMsgList>
>;

// tests
describe("Infinite Scroll", () => {
  beforeEach(() => {
    mockedUseInfiniteMsgList.mockReturnValue({});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders app without carshing", () => {
    render(<Home />);
  });

  it("should not fetch more if end not reached, even when next page is available", () => {
    const mockedFetchNextPage = jest.fn();
    mockedUseInfiniteMsgList.mockReturnValue({
      list: [],
      fetchNextPage: mockedFetchNextPage,
      hasNextPage: true,
    });

    render(<Home />);

    expect(mockedFetchNextPage).not.toBeCalled();
  });

  it("should fetch more on end reached if next page is available", () => {
    const mockedFetchNextPage = jest.fn();
    mockedUseInfiniteMsgList.mockReturnValue({
      list: [],
      fetchNextPage: mockedFetchNextPage,
      hasNextPage: true,
    });

    render(<Home />);
    onEndReached();

    expect(mockedFetchNextPage).toBeCalled();
  });

  it("should not fetch more on end reached if next page is not available", () => {
    const mockedFetchNextPage = jest.fn();
    mockedUseInfiniteMsgList.mockReturnValue({
      list: [],
      fetchNextPage: mockedFetchNextPage,
      hasNextPage: false,
    });

    render(<Home />);
    onEndReached();

    expect(mockedFetchNextPage).not.toBeCalled();
  });

  it("should not fetch more on end reached if already fetching, even when next page is available", () => {
    const mockedFetchNextPage = jest.fn();
    mockedUseInfiniteMsgList.mockReturnValue({
      list: [],
      fetchNextPage: mockedFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: true,
    });

    render(<Home />);
    onEndReached();

    expect(mockedFetchNextPage).not.toBeCalled();
  });

  it("should display the fetched messages correctly", () => {
    const count = 15;
    mockedUseInfiniteMsgList.mockReturnValue({
      list: Array(count)
        .fill(true)
        .map((_, i) => ({
          _id: i.toString(),
          text: `test-${i}`,
          createdAt: new Date().toString(),
          hasImage: false,
          imgUrl: "",
        })),
    });

    render(<Home />);

    const messages = screen.getAllByText(/test-\d+/);
    expect(messages.length).toBe(count);
    expect(messages[0]).toHaveTextContent("test-0");
    expect(messages[messages.length - 1]).toHaveTextContent(
      `test-${count - 1}`
    );
  });
});
